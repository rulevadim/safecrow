import HTTP, { setAuthHeader } from '@/services/http-common';
import { AxiosPromise } from 'axios';
import {
  CostRequest,
  CostResponse,
  Order,
  OrderClaim,
  OrderCreate,
  OrderCreateResponse,
  OrderResponse,
  OrdersListResponse,
} from '@/types/order';
import { ClaimCreate, ClaimCreateResponse } from '@/types/claim';
import { FileObjectInResponse } from '@/types/file';
import { V1LoginResponseData } from '@/services/auth';

export type OrderActions = 'order_paid' | 'work_is_done' | 'work_accepted' | 'payout_done' | 'payout_confirmed';
export type OrderAdminActions = 'order_paid' | 'payout_done';

export class V1OrdersService {
  public static URLs: Readonly<Record<string, (...args: any[]) => string>> = {
    fetchCommissions: () => '/api/v1/orders/cost',
    orders: () => '/api/v1/orders',
    order: (id: Order['order_id']) => `/api/v1/orders/${id}`,
    orderShortURL: (shortURL: Order['short_url']) => `/api/v1/orders/shorturl/${shortURL}`,
    orderClaims: (id: Order['order_id']) => `/api/v1/orders/${id}/claims`,
    orderJoin: (id: Order['order_id']) => `/api/v1/orders/${id}/join`,
    orderFiles: (id: Order['order_id']) => `/api/v1/orders/${id}/files`,
    orderFileDownload: (
      orderId: Order['order_id'],
      fileId: FileObjectInResponse['file_id'],
      token: V1LoginResponseData['token']
    ) => {
      return `/api/v1/orders/${orderId}/files/${fileId}?token=${token}`;
    },
    orderClaimFileDownload: (
      claimId: OrderClaim['claim_id'],
      fileId: FileObjectInResponse['file_id'],
      token: V1LoginResponseData['token']
    ) => {
      return `/api/v1/orders/${claimId}/files/${fileId}?token=${token}`;
    },
    orderInvoice: (id: Order['order_id']) => `/api/v1/orders/${id}/invoice`,
    executeAction: (id: Order['order_id'], actionName: OrderActions) => `/api/v1/orders/${id}/actions/${actionName}`,
    executeAdminAction: (id: Order['order_id'], actionName: OrderAdminActions) =>
      `/api/v1/admin/orders/${id}/actions/${actionName}`,
  };

  public static fetchCommissions(data: CostRequest): AxiosPromise<CostResponse> {
    return HTTP.post(this.URLs.fetchCommissions(), data);
  }

  public static createOrder(data: OrderCreate): AxiosPromise<OrderCreateResponse> {
    return HTTP.post(this.URLs.orders(), data);
  }

  public static fetchOrders(): AxiosPromise<OrdersListResponse> {
    return HTTP.get(this.URLs.orders());
  }

  public static fetchOrder(id: Order['order_id']): AxiosPromise<OrderResponse> {
    return HTTP.get(this.URLs.order(id));
  }

  public static fetchOrderByShortURL(shortURL: Order['short_url']): AxiosPromise<OrderResponse> {
    return HTTP.get(this.URLs.orderShortURL(shortURL));
  }

  public static joinOrder(id: Order['order_id']): AxiosPromise<null> {
    return HTTP.put(this.URLs.orderJoin(id));
  }

  public static fetchOrderFiles(id: Order['order_id']): AxiosPromise<OrderResponse> {
    return HTTP.get(this.URLs.orderFiles(id));
  }

  public static downloadOrderInvoice(id: Order['order_id']): any {
    // return HTTP.get(this.URLs.orderInvoice(id));
    return HTTP({
      url: this.URLs.orderInvoice(id),
      method: 'GET',
      responseType: 'blob', // important
    }).then(response => {
      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `invoice-${id}`;
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename=(.+)/);
        if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
      }
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    });
  }

  public static createClaim(claim: ClaimCreate): AxiosPromise<ClaimCreateResponse> {
    return HTTP.post(this.URLs.orderClaims(claim.order_id), claim);
  }

  public static fetchClaim(order_id: Order['order_id']): AxiosPromise<OrderClaim> {
    return HTTP.get(this.URLs.orderClaims(order_id));
  }

  public static executeAction(id: Order['order_id'], actionName: OrderActions): AxiosPromise<null> {
    return HTTP.put(this.URLs.executeAction(id, actionName));
  }

  public static executeAdminAction(
    id: Order['order_id'],
    actionName: OrderAdminActions,
    token: string
  ): AxiosPromise<{ code: number; message: string }> {
    const config = { headers: {} };
    setAuthHeader(config, token);
    return HTTP.put(this.URLs.executeAdminAction(id, actionName), null, config);
  }
}
