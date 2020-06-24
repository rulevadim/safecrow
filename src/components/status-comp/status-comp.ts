import { Component, Vue, Prop } from 'vue-property-decorator';
import IconBase from '@/components/icon-base/icon-base.vue';
import IconAlarmChecked from '@/components/icons/icon-alarm-checked.vue';
import IconCircleChecked from '@/components/icons/icon-circle-checked.vue';
import { OrderStatus } from '@/types/order';

type ComputedStatusData = {
  iconName: string;
  iconComponent: string;
  class: string;
  text: string;
};

@Component({
  components: {
    IconBase,
    IconAlarmChecked,
    IconCircleChecked,
  },
})
export default class StatusComp extends Vue {
  @Prop({ required: true }) status!: OrderStatus;
  @Prop({ default: false }) isConsumer!: boolean;
  @Prop({ default: false }) isSupplier!: boolean;

  orderStatusesMap: typeof OrderStatus = OrderStatus;

  get statusesMapData(): Record<OrderStatus, ComputedStatusData> {
    return {
      [OrderStatus.NEW]: {
        // Ожидает подтверждения второй стороной
        iconName: 'alarm-checked',
        iconComponent: 'icon-alarm-checked',
        class: 'status_orange',
        text: 'Ожидает подтверждения',
      },
      [OrderStatus.ORDER_CONFIRMED]: {
        // Ожидает оплаты
        iconName: 'alarm-checked',
        iconComponent: 'icon-alarm-checked',
        class: this.isConsumer ? 'status_red' : 'status_orange',
        text: 'Ожидает оплаты',
      },
      [OrderStatus.ORDER_PAID]: {
        // Ожидает выполнения работы
        iconName: 'alarm-checked',
        iconComponent: 'icon-alarm-checked',
        class: this.isSupplier ? 'status_red' : 'status_orange',
        text: 'Ожидает выполнения работы',
      },
      [OrderStatus.WORK_IS_DONE]: {
        // Ожидает принятия работы
        iconName: 'alarm-checked',
        iconComponent: 'icon-alarm-checked',
        class: this.isConsumer ? 'status_red' : 'status_orange',
        text: 'Ожидает принятия работы',
      },
      [OrderStatus.WORK_ACCEPTED]: {
        // Ожидает выплаты
        iconName: 'alarm-checked',
        iconComponent: 'icon-alarm-checked',
        class: 'status_orange',
        text: 'Ожидает выплаты',
      },
      [OrderStatus.PAYOUT_DONE]: {
        // Ожидает подтверждения выплаты
        iconName: 'alarm-checked',
        iconComponent: 'icon-alarm-checked',
        class: this.isSupplier ? 'status_red' : 'status_orange',
        text: 'Ожидает подтверждения выплаты',
      },
      [OrderStatus.PAYOUT_CONFIRMED]: {
        // Сделка закрыта
        iconName: 'circle-checked',
        iconComponent: 'icon-circle-checked',
        class: 'status_green',
        text: 'Сделка закрыта',
      },
      [OrderStatus.CLAIM_OPEN]: {
        // Претензия открыта
        iconName: 'alarm-checked',
        iconComponent: 'icon-alarm-checked',
        class: 'status_red',
        text: 'Претензия открыта',
      },
      [OrderStatus.CLAIM_CLOSED]: {
        // Претензия закрыта
        iconName: 'circle-checked',
        iconComponent: 'icon-circle-checked',
        class: 'status_green',
        text: 'Претензия закрыта',
      },
      [OrderStatus.ORDER_CANCELED]: {
        // Сделка отменена
        iconName: 'circle-checked',
        iconComponent: 'icon-circle-checked',
        class: 'status_red',
        text: 'Сделка отменена',
      },
    };
  }

  get computedStatusData() {
    return this.statusesMapData[this.status];
  }
}
