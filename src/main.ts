import Vue from 'vue';
import app from './app.vue';
import router, { RoutesNamesEnum } from './router';
import store from './store';
import PageLayout from '@/components/page-layout/page-layout.vue';
import { OrderHelper, OrderStatus } from '@/types/order';
import Vuelidate from 'vuelidate';
import VueTheMask from 'vue-the-mask';
import './services/font-awesome-library';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { phoneMask } from './directives/phone-mask';

Vue.use(Vuelidate);
Vue.use(VueTheMask);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('page-layout', PageLayout);

Vue.directive('numericOnly', {
  bind(el: HTMLInputElement) {
    el.addEventListener('input', () => {
      el.value = el.value.replace(/\D+/g, '');
    });
  },
});

Vue.directive('focus', {
  inserted(el: HTMLElement) {
    el.focus();
  },
});

Vue.directive('phone-mask', phoneMask);

Vue.filter('price', function (value: number) {
  const result: string = (value / 100).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ');
  return `${result} ₽`;
});

Vue.filter('account', (value: string) => {
  return value.replace(/^(\d{4}).+(\d{4})$/, '$1...$2');
});

Vue.filter('bank', (value: string) => {
  return value[0] + value.toLowerCase().substring(1);
});

Vue.prototype.$routesNames = RoutesNamesEnum;
Vue.prototype.$orderHelper = OrderHelper;
Vue.prototype.$orderStatus = OrderStatus;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(app),
}).$mount('#app');
