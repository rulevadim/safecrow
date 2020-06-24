import { Component, Mixins } from 'vue-property-decorator';
import PartnerDataPropMixin from '@/mixins/partner-data-prop-mixin';
import IconBase from '@/components/icon-base/icon-base.vue';
import IconPhone from '@/components/icons/icon-phone.vue';
import IconMail from '@/components/icons/icon-mail.vue';
import IconLocation from '@/components/icons/icon-location.vue';

@Component({
  components: {
    IconBase,
    IconPhone,
    IconMail,
    IconLocation,
  },
})
export default class Footer extends Mixins(PartnerDataPropMixin) {
  mailLink = `mailto:contact@safecrow.ru?subject=${process.env.VUE_APP_PARTNER_NAME}&body=`;
  yearFooter = new Date().getFullYear();
  isPartnerAlfabank = process.env.VUE_APP_PARTNER === 'alfabank-ru';
}
