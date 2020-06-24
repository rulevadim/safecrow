import { Component, Prop, Vue } from 'vue-property-decorator';

import { PageModule } from '@/states/page';
import { OrderShowModule } from '@/views/order-show/vuex';

import PageHeader from '@/components/page-header/page-header.vue';
import PageFooter from '@/components/page-footer/page-footer.vue';
import IconBase from '@/components/icon-base/icon-base.vue';
import IconSpinner from '@/components/icons/icon-spinner.vue';

@Component({
  components: {
    PageHeader,
    PageFooter,
    IconBase,
    IconSpinner,
  },
})
export default class PageLayout extends Vue {
  @Prop({ default: false }) hideHeader: boolean;
  @Prop({ default: false }) hideFooter: boolean;

  get pageError() {
    return PageModule.context(this.$store).state.error;
  }
  get isLoading() {
    return PageModule.context(this.$store).state.isLoading;
  }
  get orderData() {
    return OrderShowModule.context(this.$store).state.orderData;
  }

  get errorComponent() {
    if (!this.pageError) {
      return null;
    }

    const { statusCode, componentName } = this.pageError;

    if (componentName) {
      return () => import(`@/components/errors/${componentName}/${componentName}.vue`);
    }

    const mapStatusToComponent: Record<number, string> = {
      403: 'error-forbidden',
      404: 'error-not-found',
      500: 'error-server-internal',
    };
    const componentNameByStatus = mapStatusToComponent[statusCode] || mapStatusToComponent[500];
    return () => import(`@/components/errors/${componentNameByStatus}/${componentNameByStatus}.vue`);
  }

  get errorComponentProps() {
    return this.pageError?.componentProps || {};
  }

  partnerData = {
    name: process.env.VUE_APP_PARTNER_NAME,
    linkText: process.env.VUE_APP_PARTNER_LINK_TEXT,
    linkURL: process.env.VUE_APP_PARTNER_LINK_URL,
  };
}
