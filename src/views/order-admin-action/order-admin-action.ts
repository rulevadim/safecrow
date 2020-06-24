import { Component, Vue } from 'vue-property-decorator';
import { V1OrdersService } from '@/services/orders';
import { OrderStatus } from '@/types/order';

// /admin/orders/{order_id}/actions/order_paid?token={some_token}

@Component
export default class OrderAdminAction extends Vue {
  adminActionInProgress = false;
  adminActionSuccessText = '';
  adminActionErrorText = '';

  get adminActionNameToDataMap() {
    const adminActionName = Array.isArray(this.$route.params.adminActionName)
      ? this.$route.params.adminActionName[0]
      : this.$route.params.adminActionName;
    const token = Array.isArray(this.$route.query.token) ? this.$route.query.token[0] : this.$route.query.token;
    if (!(adminActionName && token)) {
      return null;
    }
    let title: string;
    if (adminActionName === OrderStatus.ORDER_PAID) {
      title = 'Оплата получена';
    } else if (adminActionName === OrderStatus.PAYOUT_DONE) {
      title = 'Выплата произведена';
    } else if (adminActionName === OrderStatus.CLAIM_CLOSED) {
      title = 'Закрыть претензию';
    } else if (adminActionName === OrderStatus.ORDER_CANCELED) {
      title = 'Отменить Сделку';
    } else if (adminActionName === OrderStatus.WORK_ACCEPTED) {
      title = 'Работа принята';
    }
    if (!title) {
      return null;
    }

    return {
      title,
      action: () => {
        this.adminActionInProgress = true;
        this.adminActionSuccessText = '';
        this.adminActionErrorText = '';
        return V1OrdersService.executeAdminAction(this.$route.params.id, adminActionName, token)
          .then(resp => {
            this.adminActionSuccessText = resp?.data?.message || 'Статус успешно изменен.';
          })
          .catch(err => {
            this.adminActionErrorText = err?.response?.data?.message || 'Произошла ошибка при попытке изменить статус.';
          })
          .finally(() => {
            this.adminActionInProgress = false;
          });
      },
    };
  }
}
