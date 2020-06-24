import { Mutations } from 'vuex-smart-module';
import { OrdersListState } from './state';
import { OrdersListResponse } from '@/types/order';

export class OrdersListMutations extends Mutations<OrdersListState> {
  setOrdersListData(ordersListData: OrdersListResponse) {
    this.state.ordersListData = ordersListData;
  }
}
