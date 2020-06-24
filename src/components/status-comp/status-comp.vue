<template>
  <div class="status" :class="computedStatusData.class">
    <div class="status__icon">
      <icon-base :icon-name="computedStatusData.iconName" :width="24" :height="24" view-box="0 0 24 24">
        <component :is="computedStatusData.iconComponent" />
      </icon-base>
    </div>
    <span class="status__text">
      {{ computedStatusData.text }}
    </span>
  </div>
</template>

<script lang="ts" src="./status-comp.ts"></script>
<style src="./status-comp.css"></style>
