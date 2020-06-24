import Vue from 'vue';
import Vuex from 'vuex';
import { createStore, Module } from 'vuex-smart-module';
import { PageModule } from './states/page';
import { AuthModule } from './states/auth';
import { OrderCreateModule } from './views/order-new/vuex';
import { OrderShowModule } from './views/order-show/vuex';
import { OrdersListModule } from './views/orders/vuex';
import { RequisitesModule } from './views/requisites/vuex';

Vue.use(Vuex);

const RootState = new Module({
  modules: {
    page: PageModule,
    auth: AuthModule,
    orderCreate: OrderCreateModule,
    orderShow: OrderShowModule,
    ordersList: OrdersListModule,
    requisites: RequisitesModule,
  },
});

export default createStore(RootState, {
  strict: process.env.NODE_ENV !== 'production',
});
