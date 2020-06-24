import { Mutations } from 'vuex-smart-module';
import { OrderShowState } from './state';
import { OrderClaim, OrderResponse } from '@/types/order';

export class OrderShowMutations extends Mutations<OrderShowState> {
  setOrderData(orderData: OrderResponse) {
    this.state.orderData = orderData;
  }

  setOrderClaimData(claimData: OrderClaim) {
    this.state.orderClaimData = claimData;
  }

  setOrderConsumerRequisites(consumer_requisites: OrderResponse['requisites']['requisite_consumer']) {
    this.state.orderData.requisites.requisite_consumer = consumer_requisites;
  }

  setOrderSupplierRequisites(supplier_requisites: OrderResponse['requisites']['requisite_supplier']) {
    this.state.orderData.requisites.requisite_supplier = supplier_requisites;
  }
}
