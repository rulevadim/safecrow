<template functional>
  <table class="table" v-bind="data.attrs" :class="[data.class, data.staticClass]" v-on="data.listeners">
    <caption v-if="$slots.caption" class="table__caption">
      <slot name="caption"></slot>
    </caption>
    <thead v-if="$slots.thead" class="table__head">
      <slot name="thead"></slot>
    </thead>
    <thead v-if="$slots.tbody" class="table__body">
      <slot name="tbody"></slot>
    </thead>
    <slot></slot>
    <tfoot v-if="$slots.tfoot" class="table__foot">
      <slot name="tfoot"></slot>
    </tfoot>
  </table>
</template>

<script lang="ts" src="./my-table.ts"></script>
<style src="./my-table.css"></style>
