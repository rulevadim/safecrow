<template>
  <div class="status-badge" :class="`status-badge_${color}`">
    <icon-base :icon-name="`${iconFinal}-checked`" :width="24" :height="24" view-box="0 0 24 24">
      <icon-alarm-checked v-if="iconFinal === 'alarm'" />
      <icon-circle-checked v-else-if="iconFinal === 'circle'" />
    </icon-base>
    <span class="status-badge__text">
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import IconBase from '@/components/icon-base/icon-base.vue';
import IconAlarmChecked from '@/components/icons/icon-alarm-checked.vue';
import IconCircleChecked from '@/components/icons/icon-circle-checked.vue';

@Component({
  components: {
    IconBase,
    IconAlarmChecked,
    IconCircleChecked,
  },
})
export default class StatusBadge extends Vue {
  @Prop(String) readonly color: 'success' | 'warning' | 'danger';
  @Prop({ required: false }) readonly icon?: 'alarm' | 'circle';

  get iconFinal() {
    if (!this.icon) {
      if (this.color === 'success') {
        return 'circle';
      } else {
        return 'alarm';
      }
    } else {
      return this.icon;
    }
  }
}
</script>

<style>
.status-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 0 1rem;
  margin-bottom: 1rem;
  font-size: 1.333333rem;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  border-radius: 6px;
}

@media (--xl) {
  .status-badge {
    width: 448px;
    max-width: 100%;
  }
}

.status-badge_danger {
  color: var(--color-danger);
  background-color: var(--color-danger_lighter);
}

.status-badge_warning {
  color: var(--color-warning);
  background-color: var(--color-warning_lighter);
}

.status-badge_success {
  color: var(--color-success);
  background-color: var(--color-success_lighter);
}

.status-badge__text {
  margin-left: 0.777778rem;
}
</style>
