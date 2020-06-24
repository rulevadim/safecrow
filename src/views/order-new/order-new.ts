import { Component, Vue, Watch } from 'vue-property-decorator';

import { AuthModule } from '@/states/auth';
import { OrderCreateModule } from './vuex';

import MyTable from '@/components/my-table/my-table.vue';
import FileUploadInputPreview from '@/components/file-upload-input-preview/file-upload-input-preview.vue';
import LoginForm from '@/components/login-form/login-form.vue';

import { AxiosResponse, AxiosPromise } from 'axios';
import { CostResponse, OrderCreate, OrderCreateResponse, OrderRoles } from '@/types/order';
import MaskedInput from 'vue-text-mask';
import Datepicker from 'vuejs-datepicker';
import { ru } from 'vuejs-datepicker/dist/locale';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import debounce from 'lodash.debounce';
import { V1FilesService } from '@/services/files';
import { FileResponse } from '@/types/file';

const costMask: any = createNumberMask({
  prefix: '',
  suffix: ' ₽',
  thousandsSeparatorSymbol: ' ',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 2,
  requireDecimal: false,
  allowNegative: false,
  allowLeadingZeroes: false,
});

@Component({
  components: {
    MyTable,
    MaskedInput,
    Datepicker,
    LoginForm,
    FileUploadInputPreview,
  },
})
export default class OrderNew extends Vue {
  fetchCommissionsAction = OrderCreateModule.context(this.$store).actions.fetchCommissions;
  createOrderAction = OrderCreateModule.context(this.$store).actions.createOrder;

  get isLoggedIn() {
    return AuthModule.context(this.$store).getters.isLoggedIn();
  }

  // undefined will not be reactive
  // (vue-class-component)
  showAuthForm: boolean = null;

  filesToUploadCount: number = null;
  filesToUpload: any[] = [];

  datepickerRuLocale = ru;
  disabledContractDates = {
    to: new Date(2000, 1, 1),
  };

  orderData: Omit<OrderCreate, 'files'> = {
    role: OrderRoles.Consumer,
    contract_number: '',
    contract_date: '',
    contract_subject: '',
    contract_cost: 0,
    commission_type: 0,
  };

  rawContractDate: Date = null;

  uploadingInProgress = false;

  costResponse: CostResponse = {
    cost: 0,
    consumer_commission: 0,
    supplier_commission: 0,
    pay_consumer: 0,
    receive_supplier: 0,
  };

  orderDataContractCostInputTouched = false;
  orderDataContractCostMin = parseInt(process.env.VUE_APP_MIN_COST_RUB) * 100;
  orderDataContractCostRubles = '';
  orderDataContractCostRublesMask = costMask;

  serverError = false;
  cols = 33;
  allowedFileMimeTypes: string[] = ['image/png', 'image/jpeg', 'application/pdf'];
  vueAppPartner: string = process.env.VUE_APP_PARTNER;

  @Watch('orderDataContractCostRubles')
  onOrderDataContractCostRublesChange(newVal: string) {
    const liveVal = parseFloat(newVal.replace(/[^\d.]/g, ''));
    this.orderData.contract_cost = Math.ceil(liveVal * 100);
  }

  get rows(): number {
    const text = this.orderData.contract_subject;
    const re = new RegExp(`[^\n]{1,${this.cols}}\n`, 'g');
    const text2 = this.orderData.contract_subject.replace(re, ''); // text without lines that are shorter than cols and ends with line break symbol
    const automaticLineBreaksCount = Math.ceil(text2.length / this.cols);
    const userLineBreaksCount = (text.match(/\n/g) || []).length;
    return automaticLineBreaksCount + userLineBreaksCount || 1;
  }

  get mapOrderCommissionConsumerToTitle() {
    return {
      100: 'Заказчик',
      0: 'Исполнитель',
      50: '50/50',
    };
  }

  get mapOrderRoleToTitle() {
    return {
      [OrderRoles.Consumer]: 'Я Заказчик',
      [OrderRoles.Supplier]: 'Я Исполнитель',
    };
  }

  get isOrderRoleValid() {
    return [OrderRoles.Consumer, OrderRoles.Supplier].includes(this.orderData.role);
  }

  get isOrderContractNumberValid() {
    return this.orderData.contract_number.length;
  }

  get isOrderContractDateValid() {
    return this.orderData.contract_date.length;
  }

  get isOrderContractSubjectValid() {
    return this.orderData.contract_subject.length;
  }

  get isOrderCostValid() {
    return this.orderData.contract_cost >= this.orderDataContractCostMin;
  }

  get isOrderCommissionValid() {
    return Object.keys(this.mapOrderCommissionConsumerToTitle).map(Number).includes(this.orderData.commission_type);
  }

  get isOrderFileValid() {
    return this.filesToUpload.length;
  }

  get isOrderFormValid() {
    return (
      this.isOrderRoleValid &&
      this.isOrderContractNumberValid &&
      this.isOrderContractDateValid &&
      this.isOrderContractSubjectValid &&
      this.isOrderCostValid &&
      this.isOrderCommissionValid &&
      this.isOrderFileValid
    );
  }

  async onSubmitOrderData() {
    if (!this.isOrderFormValid) {
      return;
    }
    this.serverError = false;
    this.uploadingInProgress = true;
    this.uploadFiles()
      .then(result => {
        const orderDataFileIds = result;
        return this.createOrderAction({ ...this.orderData, files: orderDataFileIds });
      })
      .then((resp: AxiosResponse<OrderCreateResponse>) => {
        if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'sozdat_sdelku');
        if (window.hasOwnProperty('ct')) ct('alfa_referral', 'sozdat_sdelku');
        this.$router.push({
          name: this.$routesNames.orderShow,
          params: {
            id: resp.data.order_id,
          },
        });
      })
      .catch(() => {
        this.serverError = true;
        this.uploadingInProgress = false;
      });
  }

  @Watch('rawContractDate')
  onRawContractDateChange(value: Date) {
    if (value) {
      // Date => "DD.MM.YYYY"
      this.orderData.contract_date = [
        String(value.getDate()).padStart(2, '0'),
        String(value.getMonth() + 1).padStart(2, '0'),
        value.getFullYear(),
      ].join('.');
    }
  }

  resetCostResponse() {
    this.costResponse.cost = 0;
    this.costResponse.consumer_commission = 0;
    this.costResponse.supplier_commission = 0;
    this.costResponse.pay_consumer = 0;
    this.costResponse.receive_supplier = 0;
  }

  fetchCommissions() {
    return this.fetchCommissionsAction({
      cost: this.orderData.contract_cost,
      commission_type: this.orderData.commission_type,
    }).then((resp: AxiosResponse<CostResponse>) => {
      const { cost, consumer_commission, supplier_commission, pay_consumer, receive_supplier } = resp.data;
      this.costResponse.cost = cost;
      this.costResponse.consumer_commission = consumer_commission;
      this.costResponse.supplier_commission = supplier_commission;
      this.costResponse.pay_consumer = pay_consumer;
      this.costResponse.receive_supplier = receive_supplier;
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  fetchCommissionsDebounced = debounce(this.fetchCommissions, 1000);

  get objectWithFieldsAffectingTheCommission() {
    const { role, contract_cost, commission_type } = this.orderData;
    return [role, contract_cost, commission_type];
  }

  @Watch('objectWithFieldsAffectingTheCommission')
  onObjectWithFieldsAffectingTheCommissionChange() {
    this.resetCostResponse();
    if (this.isOrderCostValid) {
      this.fetchCommissionsDebounced();
    } else {
      this.fetchCommissionsDebounced.cancel();
    }
  }

  uploadFiles() {
    const uploads: AxiosPromise[] = [];

    for (const file of this.filesToUpload) {
      uploads.push(V1FilesService.uploadFile({ files: file.file }));
    }

    return Promise.all(uploads).then((responce: AxiosResponse<FileResponse>[]) => {
      const uploadedFileIds: string[] = [];
      for (const resp of responce) {
        uploadedFileIds.push(resp.data[0].file_id);
      }
      return uploadedFileIds;
    });
  }

  // immediate value to showAuthForm = !val,
  // change only if user logout
  @Watch('isLoggedIn', { immediate: true })
  onIsLoggedInChange(val: boolean, oldVal: boolean) {
    if (oldVal === undefined) {
      this.showAuthForm = !val;
    } else if (val === false) {
      this.showAuthForm = true;
    }
  }
}
