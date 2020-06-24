import { Component, Vue } from 'vue-property-decorator';
import MyTable from '@/components/my-table/my-table.vue';
import StatusComp from '@/components/status-comp/status-comp.vue';
import { Order, OrderListResponseItem, OrderStatus } from '@/types/order';
import { OrdersListModule } from './vuex';
import { AuthModule } from '@/states/auth';

type OrderComputedData = {
  roleTitle: string;
  isConsumer: boolean;
  isSupplier: boolean;
  readableDate: string;
  oid: string;
  status: OrderStatus;
};
type OrdersComputedDataMap = Record<Order['order_id'], OrderComputedData>;

@Component({
  components: {
    MyTable,
    StatusComp,
  },
})
export default class Orders extends Vue {
  get ordersListData() {
    return OrdersListModule.context(this.$store).state.ordersListData;
  }

  get userId() {
    return AuthModule.context(this.$store).getters.userId();
  }

  getReadableOrderDate(order: OrderListResponseItem) {
    const date = new Date(order.created_at);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  get ordersComputedDataMap(): OrdersComputedDataMap {
    const map: OrdersComputedDataMap = {};
    this.ordersListData.forEach(order => {
      const role = this.$orderHelper.getOrderRoleByUserId(order, this.userId);
      map[order.order_id] = {
        oid: this.$orderHelper.computeOrderOID(order),
        readableDate: this.getReadableOrderDate(order),
        roleTitle: this.$orderHelper.mapRoleToTitle[role].ru,
        isConsumer: role === 'Consumer',
        isSupplier: role === 'Supplier',
        status: this.getOrderLastStatus(order),
      };
    });

    return map;
  }

  getOrderLastStatus(order: OrderListResponseItem): OrderStatus {
    return order.arbitration_state === OrderStatus.CLAIM_OPEN ? OrderStatus.CLAIM_OPEN : order.status;
  }
}
