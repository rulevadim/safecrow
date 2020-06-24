import { Component, Mixins } from 'vue-property-decorator';
import PartnerDataPropMixin from '@/mixins/partner-data-prop-mixin';

import { PageModule } from '@/states/page';
import { AuthModule } from '@/states/auth';

import IconBase from '@/components/icon-base/icon-base.vue';
import IconCross from '@/components/icons/icon-cross.vue';
import IconBurger from '@/components/icons/icon-burger.vue';
import IconArrowBack from '@/components/icons/icon-arrow-back.vue';

@Component({
  components: {
    IconBase,
    IconBurger,
    IconCross,
    IconArrowBack,
  },
})
export default class PageHeader extends Mixins(PartnerDataPropMixin) {
  showWarning = false;
  showModal = false;

  get pageBreakpoint() {
    return PageModule.context(this.$store).state.breakpointName;
  }

  get isLoggedIn() {
    return AuthModule.context(this.$store).getters.isLoggedIn();
  }

  logoutAction = AuthModule.context(this.$store).actions.logoutUser;

  linksListClosed = true;

  pathToLogo = process.env.BASE_URL
    ? process.env.BASE_URL + process.env.VUE_APP_PARTNER_LOGO
    : `/${process.env.VUE_APP_PARTNER_LOGO}`;

  get isNotXlBreakpoint() {
    return this.pageBreakpoint !== 'xl';
  }

  toggleLinksList() {
    this.linksListClosed = !this.linksListClosed;
  }

  get loginRoute() {
    return {
      name: this.$routesNames.authLogin,
      query: {
        redirect:
          this.$route.query.redirect || process.env.VUE_APP_PARTNER === 'alfabank-ru'
            ? this.$router.resolve({ name: this.$routesNames.orders }).href
            : this.$router.resolve({ name: this.$routesNames.home }).href,
      },
    };
  }
}
