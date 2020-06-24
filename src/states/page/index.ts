import { Module } from 'vuex-smart-module';
import { PageState } from './state';
import { PageGetters } from './getters';
import { PageMutations } from './mutations';
import { PageActions } from './actions';

export const PageModule = new Module({
  state: PageState,
  getters: PageGetters,
  mutations: PageMutations,
  actions: PageActions,
});
