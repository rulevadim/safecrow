import { Module } from 'vuex-smart-module';
import { RequisitesState } from './state';
import { RequisitesActions } from './actions';
import { RequisitesGetters } from './getters';
import { RequisitesMutations } from './mutations';

export const RequisitesModule = new Module({
  state: RequisitesState,
  getters: RequisitesGetters,
  mutations: RequisitesMutations,
  actions: RequisitesActions,
});
