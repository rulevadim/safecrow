import Vue from 'vue';
import { RoutesNamesEnum } from '@/router';
import { OrderHelper, OrderStatus } from '@/types/order';

declare module 'vue/types/vue' {
  interface Vue {
    $routesNames: { [key in keyof typeof RoutesNamesEnum]: RoutesNamesEnum };
    $orderHelper: typeof OrderHelper;
    $orderStatus: { [key in keyof typeof OrderStatus]: OrderStatus };
  }
}
