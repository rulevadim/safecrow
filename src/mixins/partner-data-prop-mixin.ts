import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import { PartnerData } from '@/types/partner';

@Component
export default class PartnerDataPropMixin extends Vue {
  @Prop({
    default: () => ({
      name: process.env.VUE_APP_PARTNER_NAME,
      linkText: process.env.VUE_APP_PARTNER_LINK_TEXT,
      linkURL: process.env.VUE_APP_PARTNER_LINK_URL,
    }),
  })
  partnerData: PartnerData;
}
