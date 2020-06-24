import { Module } from 'vuex-smart-module';
import { OrderShowState } from './state';
import { OrderShowGetters } from './getters';
import { OrderShowMutations } from './mutations';
import { OrderShowActions } from './actions';

export const OrderShowModule = new Module({
  state: OrderShowState,
  getters: OrderShowGetters,
  mutations: OrderShowMutations,
  actions: OrderShowActions,
});
