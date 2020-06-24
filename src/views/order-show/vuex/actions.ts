import { Actions } from 'vuex-smart-module';
import { OrderShowState } from './state';
import { OrderShowGetters } from './getters';
import { OrderShowMutations } from './mutations';

import store from '@/store';
import { PageModule } from '@/states/page';

import { V1OrdersService } from '@/services/orders';
import { V1RequisitesService } from '@/services/requisites';
import { Order, OrderStatus } from '@/types/order';
import { ClaimCreate } from '@/types/claim';
import { OrderLegalRequisites } from '@/types/requisites';

export class OrderShowActions extends Actions<OrderShowState, OrderShowGetters, OrderShowMutations, OrderShowActions> {
  init(payload: { id?: Order['order_id']; shortURL?: Order['short_url'] }) {
    const action = payload.id ? 'fetchOrder' : 'fetchOrderByShortURL';
    const _payload = payload.id ?? payload.shortURL;

    return this.dispatch(action, _payload).catch((err: any) => {
      const statusCode = err?.response?.status ?? 500;
      PageModule.context(store).actions.setError({ statusCode });
      throw err;
    });
  }

  fetchOrder(id: Order['order_id']) {
    return V1OrdersService.fetchOrder(id).then(resp => {
      this.mutations.setOrderData(resp.data);
      if (resp.data.order.arbitration_state === OrderStatus.CLAIM_OPEN) {
        this.dispatch('fetchOrderClaim', { id });
      }
      return resp;
    });
  }

  fetchOrderByShortURL(shortURL: Order['short_url']) {
    return V1OrdersService.fetchOrderByShortURL(shortURL).then(resp => {
      this.mutations.setOrderData(resp.data);
      if (resp.data.order.arbitration_state === OrderStatus.CLAIM_OPEN) {
        this.dispatch('fetchOrderClaim', { id: resp.data.order.order_id });
      }
      return resp;
    });
  }

  joinOrder(id: Order['order_id']) {
    return V1OrdersService.joinOrder(id).then(() => {
      return this.dispatch('fetchOrder', id);
    });
  }

  createClaim(payload: ClaimCreate) {
    return V1OrdersService.createClaim(payload).then(() => {
      return this.dispatch('fetchOrder', payload.order_id);
    });
  }

  fetchOrderClaim(payload: { id: Order['order_id'] }) {
    return V1OrdersService.fetchClaim(payload.id).then(resp => {
      this.mutations.setOrderClaimData(resp.data);
      return resp;
    });
  }

  orderPaid(payload: { order_id: Order['order_id'] }) {
    return V1OrdersService.executeAction(payload.order_id, 'order_paid').then(() => {
      return this.dispatch('fetchOrder', payload.order_id);
    });
  }

  workIsDone(payload: { order_id: Order['order_id'] }) {
    return V1OrdersService.executeAction(payload.order_id, 'work_is_done').then(() => {
      return this.dispatch('fetchOrder', payload.order_id);
    });
  }

  workAccepted(payload: { order_id: Order['order_id'] }) {
    return V1OrdersService.executeAction(payload.order_id, 'work_accepted').then(() => {
      return this.dispatch('fetchOrder', payload.order_id);
    });
  }

  payoutConfirmed(payload: { order_id: Order['order_id'] }) {
    return V1OrdersService.executeAction(payload.order_id, 'payout_confirmed').then(() => {
      return this.dispatch('fetchOrder', payload.order_id);
    });
  }

  payoutDone(payload: { order_id: Order['order_id'] }) {
    return V1OrdersService.executeAction(payload.order_id, 'payout_done').then(() => {
      return this.dispatch('fetchOrder', payload.order_id);
    });
  }

  createOrderRequisites(payload: { id: Order['order_id']; requisitesData: OrderLegalRequisites }) {
    return V1RequisitesService.createRequisite(payload.id, payload.requisitesData).then(() => {
      this.state.orderData.order.role === 1
        ? this.mutations.setOrderConsumerRequisites(payload.requisitesData)
        : this.mutations.setOrderSupplierRequisites(payload.requisitesData);
    });
  }

  updateOrderRequisites(payload: { id: Order['order_id']; requisitesData: OrderLegalRequisites }) {
    return V1RequisitesService.updateRequisite(payload.id, payload.requisitesData).then(() => {
      this.state.orderData.order.role === 1
        ? this.mutations.setOrderConsumerRequisites(payload.requisitesData)
        : this.mutations.setOrderSupplierRequisites(payload.requisitesData);
    });
  }
}
