import { Module } from 'vuex-smart-module';
import { OrdersListState } from './state';
import { OrdersListActions } from './actions';
import { OrdersListGetters } from './getters';
import { OrdersListMutations } from './mutations';

export const OrdersListModule = new Module({
  state: OrdersListState,
  getters: OrdersListGetters,
  mutations: OrdersListMutations,
  actions: OrdersListActions,
});
