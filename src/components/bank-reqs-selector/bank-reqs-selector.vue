<template>
  <div>
    <div class="bank-reqs-selector">
      <div class="bank-reqs-container" :class="{ 'bank-reqs-container_confirmed': confirmed }">
        <div ref="selector" class="bank-reqs">
          <div
            class="bank-reqs__req"
            :class="{ 'bank-reqs__req_arrow': requisites.length > 1, 'bank-reqs__req_arrow_rotate': show }"
            @click="showAllRequisites"
          >
            <span class="bank-reqs__name">{{ requisites[0].detail_name }}</span>
            <span class="bank-reqs__account"
              >{{ requisites[0].bank_name | bank }} {{ requisites[0].checking_account | account }}</span
            >
          </div>
          <template v-if="show">
            <div
              v-for="(requisite, index) in requisites.slice(1)"
              :key="requisite.requisite_id"
              class="bank-reqs__req"
              @click="selectRequisite(index + 1)"
            >
              <span class="bank-reqs__name">{{ requisite.detail_name }}</span>
              <span class="bank-reqs__account"
                >{{ requisite.bank_name | bank }} {{ requisite.checking_account | account }}</span
              >
            </div>
          </template>
        </div>
      </div>
      <transition v-if="!$scopedSlots.default" name="selector" mode="in-out">
        <button v-if="!confirmed" class="bank-reqs-submit btn btn_link" title="Подтвердить реквизиты" @click="confirm">
          <font-awesome-icon icon="check" fixed-width />
        </button>
        <button v-else class="bank-reqs-submit btn btn_link" title="Изменить выбор реквизитов" @click="edit">
          <font-awesome-icon :icon="['far', 'edit']" fixed-width />
        </button>
      </transition>
    </div>
    <slot :confirm="confirm" :show="show"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BankRequisites } from '@/types/requisites';

@Component
export default class BankReqsSelector extends Vue {
  @Prop(Array) readonly reqs!: BankRequisites[];
  requisites: BankRequisites[] = this.reqs;

  show = false;
  selectedRequisite: BankRequisites = this.requisites[0];
  confirmed = false;

  showAllRequisites() {
    if (this.requisites.length > 1) this.show = !this.show;
  }

  selectRequisite(index: number) {
    [this.selectedRequisite] = this.requisites.splice(index, 1);
    this.requisites.unshift(this.selectedRequisite);
    this.show = false;
  }

  outsideClick(event: MouseEvent) {
    if (!(this.$refs.selector as HTMLElement).contains(event.target as HTMLElement)) {
      this.show = false;
    }
  }

  confirm() {
    this.confirmed = true;
    this.$emit('confirm', this.selectedRequisite.requisite_id);
  }

  edit() {
    this.confirmed = false;
    this.$emit('unconfirmed');
  }

  mounted() {
    document.addEventListener('click', this.outsideClick, false);
  }

  destroyed() {
    document.removeEventListener('click', this.outsideClick, false);
  }
}
</script>

<style>
.bank-reqs-selector {
  display: flex;
}

.bank-reqs-container {
  position: relative;
  z-index: 100;
  flex-basis: 576px;
  flex-shrink: 0;
  max-width: 100%;
  height: calc(1.222222rem * 1.5 + 0.888889rem * 2 + 2px);
}

@media (--sm) {
  .bank-reqs-container {
    flex-grow: 1;
    flex-shrink: 1;
  }
}

@media (--xs) {
  .bank-reqs-container {
    flex-grow: 1;
    flex-shrink: 1;
  }
}

.bank-reqs {
  position: absolute;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border: 1px solid var(--color-input-border);
  border-radius: 3px;
}

.bank-reqs-container_confirmed .bank-reqs {
  pointer-events: none;
  background: var(--color-disable_lighter);
}

.bank-reqs__req {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.888889rem 1rem;
  padding-right: 30px;
  overflow: hidden;
  font-size: 1.222222rem;
}

.bank-reqs__req:hover {
  background: rgba(0, 0, 0, 0.25);
}
.bank-reqs__req:first-child:hover {
  background: transparent;
}

.bank-reqs__req_arrow::before {
  position: absolute;
  right: 0;
  width: 1rem;
  height: 1rem;
  content: '';
  background: url(~@/assets/expand_more_24px.svg) no-repeat center !important;
  transition: 250ms;
}

.bank-reqs__req_arrow_rotate::before {
  transform: rotate(180deg);
}

.bank-reqs__name,
.bank-reqs__account {
  white-space: nowrap;
  user-select: none;
}

.bank-reqs__name {
  margin-right: 1rem;
  font-weight: bold;
}

.bank-reqs__account {
  overflow: hidden;
}

.bank-reqs-submit {
  margin-left: 1rem;
  font-size: 1.111111rem;
  font-weight: bold;
  line-height: 1;
  text-align: left;
  word-break: keep-all;
}

/* For <transition> component */
.selector-enter-active,
.selector-leave-active {
  transition: opacity 500ms;
}
.selector-enter,
.selector-leave-to {
  opacity: 0;
}
</style>
