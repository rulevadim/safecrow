<template>
  <router-view></router-view>
</template>

<script lang="ts">
import './css/index.css';
import { Component, Watch, Vue } from 'vue-property-decorator';
import { PageBreakpointName } from '@/states/page/state';
import { PageModule } from '@/states/page';

@Component
export default class App extends Vue {
  setPageBreakpointAction = PageModule.context(this.$store).actions.setPageBreakpoint;

  window: { width: number; height: number } = { width: 0, height: 0 };
  breakpointsValues: { xs: number; sm: number; xl: number } = {
    xs: 576, // --breakpoint_xs
    sm: 768, // --breakpoint_sm
    xl: 1920, // --breakpoint_xl
  };

  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.setPageBreakpointAction({ name: this.currentBreakpoint });
  }

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.window.width = window.innerWidth;
    this.window.height = window.innerHeight;
  }

  get currentBreakpoint(): PageBreakpointName {
    if (this.window.width < this.breakpointsValues.xs) {
      return 'xs';
    } else if (this.window.width < this.breakpointsValues.sm) {
      return 'sm';
    }
    return 'xl';
  }

  @Watch('currentBreakpoint')
  onChangeBreakpoint(newVal: PageBreakpointName) {
    this.setPageBreakpointAction({ name: newVal });
  }
}
</script>
