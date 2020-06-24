import { Module } from 'vuex-smart-module';
import { OrderCreateState } from './state';
import { OrderCreateGetters } from './getters';
import { OrderCreateMutations } from './mutations';
import { OrderCreateActions } from './actions';

export const OrderCreateModule = new Module({
  state: OrderCreateState,
  getters: OrderCreateGetters,
  mutations: OrderCreateMutations,
  actions: OrderCreateActions,
});
