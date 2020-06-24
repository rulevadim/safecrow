import { Component, Prop, Vue } from 'vue-property-decorator';
import IconBase from '@/components/icon-base/icon-base.vue';
import IconAlarmChecked from '@/components/icons/icon-alarm-checked.vue';
import IconCircleChecked from '@/components/icons/icon-circle-checked.vue';
import MyTable from '@/components/my-table/my-table.vue';
import { OrderRoles, OrderStatus } from '@/types/order';
import IconCopy from '@/components/icons/icon-copy.vue';
import IconPaperclip from '@/components/icons/icon-paperclip.vue';
import LoginForm from '@/components/login-form/login-form.vue';
import { V1OrdersService } from '@/services/orders';
import { FileObjectInResponse } from '@/types/file';
import { ClaimCreate } from '@/types/claim';
import StatusComp from '@/components/status-comp/status-comp.vue';
import FileUploadInput from '@/components/file-upload-input/file-upload-input.vue';
import StatusBadge from '@/components/status-badge/status-badge.vue';
import { LegalRequisites, OrderLegalRequisites, BankRequisites, Contacts, CompanyInfo } from '@/types/requisites';
import BankReqsSelector from '@/components/bank-reqs-selector/bank-reqs-selector.vue';
import { User } from '@/types/user';
import { PageModule } from '@/states/page';
import { AuthModule } from '@/states/auth';
import { OrderShowModule } from './vuex';
import { RequisitesModule } from '../requisites/vuex';

const downloadInvoiceThrottleSeconds = 60;

@Component({
  components: {
    IconBase,
    IconAlarmChecked,
    IconCircleChecked,
    IconCopy,
    IconPaperclip,
    MyTable,
    LoginForm,
    StatusComp,
    FileUploadInput,
    BankReqsSelector,
    StatusBadge,
  },
})
export default class OrderShow extends Vue {
  showStates = false;
  showCopyHint = false;
  showCopyHintTime = 1500;

  @Prop() orderId?: string;
  @Prop() orderShortURL?: string;

  get pageBreakpoint() {
    return PageModule.context(this.$store).state.breakpointName;
  }

  get authToken() {
    return AuthModule.context(this.$store).state.token;
  }

  get isLoggedIn() {
    return AuthModule.context(this.$store).getters.isLoggedIn();
  }

  get userId() {
    return AuthModule.context(this.$store).getters.userId();
  }

  get orderData() {
    return OrderShowModule.context(this.$store).state.orderData;
  }

  get orderClaimData() {
    return OrderShowModule.context(this.$store).state.orderClaimData;
  }

  orderJoinAction = OrderShowModule.context(this.$store).actions.joinOrder;
  createClaimAction = OrderShowModule.context(this.$store).actions.createClaim;
  setOrderAsPaidAction = OrderShowModule.context(this.$store).actions.orderPaid;
  setOrderWorkIsDoneAction = OrderShowModule.context(this.$store).actions.workIsDone;
  setOrderWorkAcceptedAction = OrderShowModule.context(this.$store).actions.workAccepted;
  setOrderPayoutDoneAction = OrderShowModule.context(this.$store).actions.payoutDone;
  setOrderPayoutConfirmedAction = OrderShowModule.context(this.$store).actions.payoutConfirmed;
  createOrderRequisitesAction = OrderShowModule.context(this.$store).actions.createOrderRequisites;
  updateOrderRequisitesAction = OrderShowModule.context(this.$store).actions.updateOrderRequisites;

  get requisitesData() {
    return RequisitesModule.context(this.$store).state.requisitesData;
  }

  requisitesInitAction = RequisitesModule.context(this.$store).actions.init;
  fetchCompanyInfoAction = RequisitesModule.context(this.$store).actions.fetchCompanyInfo;
  fetchContactsAction = RequisitesModule.context(this.$store).actions.fetchContacts;

  get status() {
    if (this.orderData.order.arbitration_state === OrderStatus.CLAIM_OPEN) return OrderStatus.CLAIM_OPEN;
    return this.orderData.order.status;
  }

  get isRequisitesExists() {
    return (
      !!this.requisitesData.company_info && !!this.requisitesData.bank_requisites && !!this.requisitesData.contacts
    );
  }

  get isOrderRequisitesExists() {
    return {
      consumer: !!this.orderData.requisites.requisite_consumer,
      supplier: !!this.orderData.requisites.requisite_supplier,
    };
  }

  otherMemberInfo: { consumer: CompanyInfo & Contacts; supplier: CompanyInfo & Contacts } = {
    consumer: null,
    supplier: null,
  };
  getOtherMemberInfoResponceWaiting = false;

  claimData: Omit<ClaimCreate, 'files'> = {
    order_id: '',
    description: '',
  };
  claimDataFileIds: string[] = [];
  uploadingInProgress = false;
  claimFormShown = false;
  confirmationRequestInProgress = false;
  allowedFileMimeTypes: string[] = ['image/png', 'image/jpeg', 'application/pdf'];

  invoiceTimer: number = downloadInvoiceThrottleSeconds;
  invoiceTimerInterval: number = null;
  enableWorkIsDoneBtn = false;
  confirmedBankReqsId: string = null;

  vueAppPartner: string = process.env.VUE_APP_PARTNER;

  getOtherMemberInfo(userId: User['id'], role: 'consumer' | 'supplier') {
    if (!this.getOtherMemberInfoResponceWaiting) {
      this.getOtherMemberInfoResponceWaiting = true;
      Promise.all([this.fetchCompanyInfoAction(userId), this.fetchContactsAction(userId)]).then(
        ([info, contacts]: [CompanyInfo, Contacts]) => {
          this.otherMemberInfo[role] = { ...info, ...contacts };
          this.getOtherMemberInfoResponceWaiting = false;
        }
      );
    }
  }

  get memberInfo() {
    let consumer, supplier, myRequisites;

    const emptyRequisites = {
      company_name: '',
      contact_user_position: '',
      contact_user_fio: '',
      contact_user_phone: '',
      contact_user_email: '',
    };

    consumer = supplier = emptyRequisites;

    if (this.isRequisitesExists) {
      myRequisites = {
        company_name: this.requisitesData.company_info.company_name,
        contact_user_position: this.requisitesData.contacts.contact_user_position,
        contact_user_fio: this.requisitesData.contacts.contact_user_fio,
        contact_user_phone: this.requisitesData.contacts.contact_user_phone,
        contact_user_email: this.requisitesData.contacts.contact_user_email,
      };
    } else {
      myRequisites = emptyRequisites;
    }

    if (this.isOrderRequisitesExists.consumer) {
      consumer = {
        company_name: this.orderData.requisites.requisite_consumer.company_name,
        contact_user_position: this.orderData.requisites.requisite_consumer.contact_user_position,
        contact_user_fio: this.orderData.requisites.requisite_consumer.contact_user_fio,
        contact_user_phone: this.orderData.requisites.requisite_consumer.contact_user_phone,
        contact_user_email: this.orderData.requisites.requisite_consumer.contact_user_email,
      };
    } else {
      if ([0, 2].includes(this.orderData.order.role) && this.orderData.order.consumer_id) {
        if (this.otherMemberInfo.consumer) {
          consumer = {
            company_name: this.otherMemberInfo.consumer.company_name,
            contact_user_position: this.otherMemberInfo.consumer.contact_user_position,
            contact_user_fio: this.otherMemberInfo.consumer.contact_user_fio,
            contact_user_phone: this.otherMemberInfo.consumer.contact_user_phone,
            contact_user_email: this.otherMemberInfo.consumer.contact_user_email,
          };
        } else {
          this.getOtherMemberInfo(this.orderData.order.consumer_id, 'consumer');
        }
        // Условие выполняется только при авторизации
      } else if (this.orderData.order.role === 1) {
        consumer = myRequisites;
      }
    }

    if (this.isOrderRequisitesExists.supplier) {
      supplier = {
        company_name: this.orderData.requisites.requisite_supplier.company_name,
        contact_user_position: this.orderData.requisites.requisite_supplier.contact_user_position,
        contact_user_fio: this.orderData.requisites.requisite_supplier.contact_user_fio,
        contact_user_phone: this.orderData.requisites.requisite_supplier.contact_user_phone,
        contact_user_email: this.orderData.requisites.requisite_supplier.contact_user_email,
      };
    } else {
      if ([0, 1].includes(this.orderData.order.role) && this.orderData.order.supplier_id) {
        if (this.otherMemberInfo.supplier) {
          supplier = {
            company_name: this.otherMemberInfo.supplier.company_name,
            contact_user_position: this.otherMemberInfo.supplier.contact_user_position,
            contact_user_fio: this.otherMemberInfo.supplier.contact_user_fio,
            contact_user_phone: this.otherMemberInfo.supplier.contact_user_phone,
            contact_user_email: this.otherMemberInfo.supplier.contact_user_email,
          };
        } else {
          this.getOtherMemberInfo(this.orderData.order.supplier_id, 'supplier');
        }
        // Условие выполняется только при авторизации
      } else if (this.orderData.order.role === 2) {
        supplier = myRequisites;
      }
    }

    return { consumer, supplier };
  }

  get link() {
    const resolvedData = this.$router.resolve({
      name: this.$routesNames.orderShowShort,
      params: {
        shortURL: this.orderData.order.short_url,
      },
    });
    return `${window.location.origin}${resolvedData.href}`;
  }

  getFileDownloadLink(fileObject: FileObjectInResponse) {
    return V1OrdersService.URLs.orderFileDownload(this.orderData.order.order_id, fileObject.file_id, this.authToken);
  }

  getClaimFileDownloadLink(fileObject: FileObjectInResponse) {
    return V1OrdersService.URLs.orderFileDownload(this.orderClaimData.claim_id, fileObject.file_id, this.authToken);
  }

  get isConsumer() {
    return this.orderData?.order.role === OrderRoles.Consumer;
  }

  get isSupplier() {
    return this.orderData?.order.role === OrderRoles.Supplier;
  }

  get isOwner() {
    return this.orderData?.order.owner_id === this.userId;
  }

  get orderStatusesMap() {
    return OrderStatus;
  }

  get isXlBreakpoint() {
    return this.pageBreakpoint === 'xl';
  }

  get isClaimDescriptionValid() {
    return this.claimData.description.length;
  }

  get isClaimFormValid() {
    return this.isClaimDescriptionValid;
  }

  toggleClaimForm() {
    if (this.claimFormShown) {
      if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'otmena_pretenzii');
      if (window.hasOwnProperty('ct')) ct('alfa_referral', 'otmena_pretenzii');
    } else {
      if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'otkrit_pretenziu');
      if (window.hasOwnProperty('ct')) ct('alfa_referral', 'otkrit_pretenziu');
    }
    this.claimFormShown = !this.claimFormShown;
  }

  onSubmitClaimData() {
    if (!this.isClaimFormValid) {
      return;
    }
    this.claimData.order_id = this.orderData.order.order_id;
    this.createClaimAction({ ...this.claimData, files: this.claimDataFileIds }).then(() => {
      this.claimFormShown = false;
    });
    if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'otkrit_pretenziu_final');
    if (window.hasOwnProperty('ct')) ct('alfa_referral', 'otkrit_pretenziu_final');
  }

  copyLink() {
    const inputEl = this.$refs.linkInput as HTMLInputElement;
    inputEl.select();
    inputEl.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand('copy');
    this.showCopyHint = true;
    setTimeout(() => {
      this.showCopyHint = false;
    }, this.showCopyHintTime);
    // alert("Скопированный текст: " + inputEl.value);
  }

  onRegisterByEmailSuccess() {
    localStorage.setItem('redirectPath', this.$route.path);
  }

  onConfirmClick() {
    this.confirmationRequestInProgress = true;
    this.orderJoinAction(this.orderData.order.order_id).finally(() => {
      this.confirmationRequestInProgress = false;
    });
    if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'podtverdit_sdelku');
    if (window.hasOwnProperty('ct')) ct('alfa_referral', 'podtverdit_sdelku');
  }

  downloadInvoice() {
    if (this.invoiceTimerInterval) return;
    this.invoiceTimerInterval = window.setInterval(() => {
      if (this.invoiceTimer > 0) {
        this.invoiceTimer--;
      } else {
        clearInterval(this.invoiceTimerInterval);
        this.invoiceTimerInterval = null;
        this.invoiceTimer = downloadInvoiceThrottleSeconds;
      }
    }, 1000);
    const orderRequisites = this.mapRequisitesToOrderRequisites(this.requisitesData);
    this.createUpdateOrderRequisites(orderRequisites)
      .then(() => {
        V1OrdersService.downloadOrderInvoice(this.orderData.order.order_id);
        if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'poluchit_schet');
        if (window.hasOwnProperty('ct')) ct('alfa_referral', 'poluchit_schet');
      })
      .catch((error: Error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  onConfirmBankRequisite(bank_requisites_id: BankRequisites['requisite_id']) {
    this.confirmedBankReqsId = bank_requisites_id;
    this.enableWorkIsDoneBtn = true;
  }

  onUnconfirmedBankRequisite() {
    this.enableWorkIsDoneBtn = false;
  }

  workIsDoneBtnHandler() {
    const orderRequisites = this.mapRequisitesToOrderRequisites(this.requisitesData, this.confirmedBankReqsId);
    const requestData = { id: this.orderData.order.order_id, requisitesData: orderRequisites };
    this.createOrderRequisitesAction(requestData)
      .then(() => {
        this.setOrderWorkIsDone();
      })
      .catch((error: Error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }

  setOrderAsPaid() {
    return this.setOrderAsPaidAction({ order_id: this.orderData.order.order_id });
  }

  setOrderWorkIsDone() {
    if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'zakaz_vipolnen');
    if (window.hasOwnProperty('ct')) ct('alfa_referral', 'zakaz_vipolnen');
    return this.setOrderWorkIsDoneAction({ order_id: this.orderData.order.order_id });
  }

  setOrderWorkAccepted() {
    if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'prinyat_rabotu');
    if (window.hasOwnProperty('ct')) ct('alfa_referral', 'prinyat_rabotu');
    return this.setOrderWorkAcceptedAction({ order_id: this.orderData.order.order_id });
  }

  setOrderPayoutDone() {
    return this.setOrderPayoutDoneAction({ order_id: this.orderData.order.order_id });
  }

  setOrderPayoutConfirmed() {
    if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'podtverdit_viplatu');
    if (window.hasOwnProperty('ct')) ct('alfa_referral', 'podtverdit_viplatu');
    return this.setOrderPayoutConfirmedAction({ order_id: this.orderData.order.order_id });
  }

  createUpdateOrderRequisites(orderRequisites: OrderLegalRequisites) {
    const role = this.isConsumer ? 'consumer' : 'supplier';
    const requestData = { id: this.orderData.order.order_id, requisitesData: orderRequisites };

    return new Promise((resolve, reject) => {
      if (this.isOrderRequisitesExists[role]) {
        const requisite = this.isConsumer ? 'requisite_consumer' : 'requisite_supplier';
        const isRequisitesUpdated = Object.keys(orderRequisites).some(
          (key: keyof OrderLegalRequisites) => orderRequisites[key] !== this.orderData.requisites[requisite][key]
        );

        if (isRequisitesUpdated) {
          this.updateOrderRequisitesAction(requestData)
            .then(() => {
              resolve('update');
            })
            .catch((error: Error) => {
              reject(error);
            });
        } else resolve('nothing');
      } else {
        this.createOrderRequisitesAction(requestData)
          .then(() => {
            resolve('create');
          })
          .catch((error: Error) => {
            reject(error);
          });
      }
    });
  }

  mapRequisitesToOrderRequisites(
    requisites: LegalRequisites,
    requisite_id?: BankRequisites['requisite_id']
  ): OrderLegalRequisites {
    const bankRequisites = requisite_id
      ? requisites.bank_requisites.find(requisite => requisite.requisite_id === requisite_id)
      : requisites.bank_requisites.find(requisite => requisite.default_detail);
    const orderRequisites = { ...requisites.company_info, ...bankRequisites, ...requisites.contacts };
    return {
      company_inn: orderRequisites.inn,
      company_kpp: orderRequisites.kpp,
      company_legal_address: orderRequisites.legal_address,
      company_name: orderRequisites.company_name,
      company_ogrn: orderRequisites.ogrn,
      company_phisical_address: orderRequisites.physical_address,
      chief_user_basis_for_action: orderRequisites.grounds_for_actions,
      chief_user_fio: orderRequisites.chief_user_fio,
      chief_user_position: orderRequisites.chief_user_position,
      bank_address: orderRequisites.address,
      bank_checking_account: orderRequisites.checking_account,
      bank_city: orderRequisites.address,
      bank_corr_account: orderRequisites.corr_account,
      bank_identification_code: orderRequisites.bank_identification_code,
      bank_name: orderRequisites.bank_name,
      contact_user_email: orderRequisites.contact_user_email,
      contact_user_fio: orderRequisites.contact_user_fio,
      contact_user_phone: orderRequisites.contact_user_phone,
      contact_user_position: orderRequisites.contact_user_position,
    };
  }

  createNewDealBtnClickHandler() {
    if (window.hasOwnProperty('ym')) ym(process.env.VUE_APP_YANDEX_COUNTER, 'reachGoal', 'sozdat_novuyu_sdelku');
    if (window.hasOwnProperty('ct')) ct('alfa_referral', 'sozdat_novuyu_sdelku');
  }

  onLoginSuccess() {
    this.requisitesInitAction();
    window.scrollTo(0, 0);
  }
}
