import { Component, Vue } from 'vue-property-decorator';
import IconBase from '@/components/icon-base/icon-base.vue';
import IconPerson from '@/components/icons/icon-person.vue';
import IconSync from '@/components/icons/icon-sync.vue';
import IconBuilding from '@/components/icons/icon-building.vue';

@Component({
  components: {
    IconBase,
    IconPerson,
    IconSync,
    IconBuilding,
  },
})
export default class Home extends Vue {}
