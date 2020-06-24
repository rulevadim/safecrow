import { Actions } from 'vuex-smart-module';
import { OrderCreateState } from './state';
import { OrderCreateGetters } from './getters';
import { OrderCreateMutations } from './mutations';

import { V1OrdersService } from '@/services/orders';
import { CostRequest, OrderCreate } from '@/types/order';

export class OrderCreateActions extends Actions<
  OrderCreateState,
  OrderCreateGetters,
  OrderCreateMutations,
  OrderCreateActions
> {
  fetchCommissions(payload: CostRequest) {
    return V1OrdersService.fetchCommissions(payload);
  }

  createOrder(payload: OrderCreate) {
    return V1OrdersService.createOrder(payload);
  }
}
