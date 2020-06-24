<template>
  <div class="payment-method">
    <div class="payment-method__field" :class="{ 'payment-method__field_base': base }">
      <span class="payment-method__name">{{ name }}</span>
      <span class="payment-method__data">{{ data }}</span>
    </div>
    <button v-if="!base" class="payment-method__button btn btn_link" type="button" @click="$emit('base-method')">
      Сделать основным
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class PaymentMethod extends Vue {
  @Prop({ default: false }) readonly base!: boolean;
  @Prop(String) readonly name!: string;
  @Prop(String) readonly data!: string;
}
</script>

<style>
.payment-method {
  position: relative;
  display: flex;
}

@media (--sm) {
  .payment-method {
    flex-wrap: wrap;
  }
}

@media (--xs) {
  .payment-method {
    flex-wrap: wrap;
  }
}

.payment-method + .payment-method {
  margin-top: 1rem;
}

.payment-method__field {
  display: flex;
  flex-basis: 576px;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0.888889rem 1rem;
  overflow: hidden;
  font-size: 1.222222rem;
  line-height: normal !important;
  background: transparent;
  border: 1px solid var(--color-input-border);
  border-radius: 3px;
}

@media (--sm) {
  .payment-method__field {
    flex-grow: 1;
    flex-shrink: 1;
  }
}

@media (--xs) {
  .payment-method__field {
    flex-grow: 1;
    flex-shrink: 1;
  }
}

.payment-method__field_base {
  background: var(--color-disable_lighter);
  border-color: transparent;
}

.payment-method__name {
  margin-right: 1rem;
}

.payment-method__name,
.payment-method__data {
  white-space: nowrap;
}

.payment-method__button {
  margin-left: 1rem;
  font-size: 1.111111rem;
  font-weight: bold;
  line-height: 1;
  text-align: left;
  word-break: keep-all;
}

@media (--sm) {
  .payment-method__button {
    flex-shrink: 1;
    margin-top: 3px;
    margin-left: auto;
  }
}

@media (--xs) {
  .payment-method__button {
    flex-shrink: 1;
    margin-top: 3px;
    margin-left: auto;
  }
}
</style>
