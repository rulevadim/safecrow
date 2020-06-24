import { FileResponse } from '@/types/file';
// import { OrderLegalRequisites } from "@/types/requisites";

export enum OrderRoles {
  UNKNOWN = 0,
  Consumer = 1,
  Supplier = 2,
}

export const OrderStatusesQueue = [
  'new',
  'order_confirmed',
  'order_paid',
  'work_is_done',
  'work_accepted',
  'payout_done',
  'payout_confirmed',
];

export enum OrderStatus {
  NEW = 'new', // Новая / Ожидает подтверждения второй стороной
  ORDER_CONFIRMED = 'order_confirmed', // Подтверждена (вторая сторона вошла в Сделку) / Ожидает оплаты
  ORDER_PAID = 'order_paid', // Оплачена / Ожидает выполнения работы
  WORK_IS_DONE = 'work_is_done', // Работа выполнена / Ожидает принятия работы
  WORK_ACCEPTED = 'work_accepted', // Работа принята / Ожидает выплаты
  PAYOUT_DONE = 'payout_done', // Выплата произведена / Ожидает подтверждения выплаты
  PAYOUT_CONFIRMED = 'payout_confirmed', // Выплата подтверждена / Сделка закрыта
  CLAIM_OPEN = 'claim_open', // Открыта претензия
  CLAIM_CLOSED = 'claim_closed', // Претензия закрыта
  ORDER_CANCELED = 'order_canceled', // Претензия закрыта
}

export type OrderHistoryItem = {
  created_at: string;
  status: OrderStatus;
};

export type CostRequest = {
  cost: number; // `validate:"gte=500000"`
  commission_type: number; // `validate:"gte=0,lte=100"`
};

export type CostResponse = {
  cost: number;
  consumer_commission: number;
  supplier_commission: number;
  pay_consumer: number;
  receive_supplier: number;
};

export type OrderCreate = {
  role: 0 | 1 | 2; //              OrderRoles;
  contract_number: string; // `validate:"required"`
  contract_date: string; // `validate:"required"` //DD.MM.YYYY
  contract_subject: string; // `validate:"required"`
  contract_cost: number; // `validate:"gte=500000"`
  commission_type: number; // `validate:"gte=0,lte=100"`

  files: string[];
};

export type OrderCreateResponse = {
  order_id: string;
};

export type Order = Omit<OrderCreate, 'files'> & {
  order_id: string;
  short_url: string;
  status: OrderStatus;
  enumerated_id: number;
  enumerated_partner_id: number;
  consumer_id?: string;
  supplier_id?: string;
  owner_id?: string;
  created_at: string;
  arbitration_state: OrderStatus.CLAIM_OPEN | OrderStatus.CLAIM_CLOSED;
};

export type OrderResponse = {
  cost: CostResponse;
  files: FileResponse;
  order: Order;
  requisites: {
    requisite_consumer: any;
    requisite_supplier: any;
  };
  status_history: OrderHistoryItem[];
};

export type OrderClaim = {
  claim_id: 'string';
  comment: 'string';
  description: 'string';
  files: FileResponse;
  state: 'string';
};

export type OrderListResponseItem = Pick<
  Order,
  | 'order_id'
  | 'status'
  | 'role'
  | 'short_url'
  | 'contract_cost'
  | 'contract_date'
  | 'contract_number'
  | 'contract_subject'
  | 'created_at'
  | 'consumer_id'
  | 'supplier_id'
  | 'enumerated_id'
  | 'enumerated_partner_id'
  | 'arbitration_state'
>;

export type OrdersListResponse = OrderListResponseItem[];

export class OrderHelper {
  public static readonly mapRoleToTitle = {
    Consumer: {
      ru: 'Заказчик',
    },
    Supplier: {
      ru: 'Исполнитель',
    },
    UNKNOWN: {
      ru: 'Третья сторона',
    },
  };

  public static getOrderRoleByUserId(
    order: { consumer_id?: string; supplier_id?: string },
    userId: string
  ): keyof typeof OrderRoles {
    if (!userId) {
      throw `User id must be UUID string: ${userId} (${typeof userId})`;
    }

    if (order.consumer_id === userId) {
      return 'Consumer';
    } else if (order.supplier_id === userId) {
      return 'Supplier';
    } else {
      return 'UNKNOWN';
    }
  }

  public static computeOrderOID<T extends Pick<Order, 'created_at' | 'enumerated_partner_id'>>(order: T): string {
    const date = new Date(order.created_at);
    const YYYY = String(date.getFullYear());
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const DD = String(date.getDate()).padStart(2, '0');
    return [`${YYYY}${MM}${DD}`, process.env.VUE_APP_PARTNER_OID, order.enumerated_partner_id].join('-');
  }
}
