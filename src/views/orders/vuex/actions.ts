import { Actions } from 'vuex-smart-module';
import { OrdersListState } from './state';
import { OrdersListGetters } from './getters';
import { OrdersListMutations } from './mutations';

import store from '@/store';
import { PageModule } from '@/states/page';

import { V1OrdersService } from '@/services/orders';

export class OrdersListActions extends Actions<
  OrdersListState,
  OrdersListGetters,
  OrdersListMutations,
  OrdersListActions
> {
  init(): any {
    return this.actions.fetchOrders().catch(err => {
      const statusCode = err?.response?.status ?? 500;
      PageModule.context(store).actions.setError({ statusCode });
      throw err;
    });
  }

  fetchOrders() {
    return V1OrdersService.fetchOrders().then(resp => {
      this.mutations.setOrdersListData(resp.data);
    });
  }
}
