<template>
  <page-layout>
    <main class="page-main page-main_order-new">
      <div class="page-main__title">Информация о&nbsp;Сделке</div>
      <form class="order-new-form" @submit.prevent="onSubmitOrderData">
        <div class="form-group">
          <label class="form-group__label" for="role">Ваша роль</label>
          <select id="role" v-model.number="orderData.role" name="role" class="form-group__input select">
            <option
              v-for="(roleTitle, roleValue) in mapOrderRoleToTitle"
              :key="roleValue"
              :value="roleValue"
              class="select__option"
            >
              {{ roleTitle }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-group__label" for="contract_number">Номер договора</label>
          <input
            id="contract_number"
            v-model="orderData.contract_number"
            name="contract_number"
            class="form-group__input input"
            placeholder="_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _"
          />
        </div>

        <div class="form-group">
          <label class="form-group__label" for="contract_date">Дата договора</label>
          <datepicker
            id="contract_date"
            v-model="rawContractDate"
            name="contract_date"
            input-class="form-group__input input order-new-form__input_date"
            placeholder="__.__.____"
            :language="datepickerRuLocale"
            format="dd.MM.yyyy"
            :disabled-dates="disabledContractDates"
            :monday-first="true"
          />
        </div>

        <div class="form-group">
          <label class="form-group__label" for="contract_subject">Предмет договора</label>
          <textarea
            id="contract_subject"
            v-model="orderData.contract_subject"
            name="contract_subject"
            :rows="rows + 1"
            :cols="cols"
            class="form-group__input textarea order-new-form__textarea"
            placeholder="Детали договора с Исполнителем"
          ></textarea>
        </div>

        <file-upload-input-preview v-model="filesToUpload" class="form-group form-group_file" />

        <div class="form-group">
          <label class="form-group__label" for="contract_cost">Сумма договора</label>
          <masked-input
            id="contract_cost"
            v-model="orderDataContractCostRubles"
            name="contract_cost"
            class="form-group__input input"
            :class="{ input_error: !isOrderCostValid && orderDataContractCostInputTouched }"
            placeholder="0.00 ₽"
            :mask="orderDataContractCostRublesMask"
            :min="orderDataContractCostMin / 100"
            @blur="orderDataContractCostInputTouched = true"
          />
          <div v-if="!isOrderCostValid && orderDataContractCostInputTouched" class="form-group__error">
            Сумма договора должна быть не менее {{ orderDataContractCostMin / 100 }} рублей, измените сумму.
          </div>
        </div>

        <div class="form-group">
          <div class="form-group__label form-group__label_commission">Кто платит за комиссию:</div>

          <div
            v-for="(title, commission_type) in mapOrderCommissionConsumerToTitle"
            :key="commission_type"
            class="order-new-form-group__radio-wrapper"
          >
            <label class="form-group__label order-new-form-group__label_thin">
              <input
                v-model.number="orderData.commission_type"
                :value="commission_type"
                name="payerCustomer"
                class="input"
                type="radio"
              />
              <span class="order-new-form-group__label__text">
                {{ title }}
              </span>
            </label>
          </div>
        </div>
      </form>

      <div class="page-main__title">Расчет стоимости</div>

      <div class="tables">
        <div class="table-wrapper">
          <table class="table table_cost">
            <thead>
              <tr>
                <th colspan="3">Для Заказчика</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Сумма договора</td>
                <td class="table__dots"></td>
                <td>{{ (orderData.contract_cost || 0) | price }}</td>
              </tr>
              <tr>
                <td>Защита Сделки</td>
                <td class="table__dots"></td>
                <td>{{ (costResponse.consumer_commission || 0) | price }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Итого к&nbsp;оплате:</td>
                <td class="table__dots"></td>
                <td>{{ (costResponse.pay_consumer || 0) | price }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="table-wrapper">
          <table class="table table_cost">
            <thead>
              <tr>
                <th colspan="3">Для Исполнителя</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Сумма договора</td>
                <td class="table__dots"></td>
                <td>{{ (orderData.contract_cost || 0) | price }}</td>
              </tr>
              <tr>
                <td>Защита Сделки</td>
                <td class="table__dots"></td>
                <td>{{ (costResponse.supplier_commission || 0) | price }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Исполнитель получит:</td>
                <td class="table__dots"></td>
                <td>{{ (costResponse.receive_supplier || 0) | price }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <login-form
        v-if="showAuthForm === true"
        class="order-show-form"
        :is-need-redirect-after-login="false"
        :disabled="!isOrderFormValid"
        :create-deal="true"
        :uploading-in-progress="uploadingInProgress"
        @login-success="onSubmitOrderData"
      ></login-form>

      <button
        v-else-if="showAuthForm === false"
        :disabled="vueAppPartner === 'alfabank-ru' || uploadingInProgress || !isOrderFormValid || !isLoggedIn"
        class="btn btn_primary btn_submit order-new-form__submit-btn createDeal"
        type="button"
        @click="onSubmitOrderData"
      >
        Создать Сделку
        <font-awesome-icon v-if="uploadingInProgress" icon="sync" spin class="order-new-form__submit-btn-icon" />
        <template v-if="vueAppPartner === 'alfabank-ru'">
          <div class="warn">
            Уважаемые пользователи, по&nbsp;техническим причинам создание сделок сейчас невозможно. Все ранее созданные
            сделки будут проведены в&nbsp;штатном режиме. Приносим извинения за&nbsp;доставленные неудобства.
          </div>
        </template>
      </button>

      <div v-if="serverError" class="form-group__error">
        Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.
      </div>

      <div class="page-main-rules">
        Нажимая на кнопку «Создать Сделку», Вы принимаете
        <a :href="$router.resolve({ name: $routesNames.orderTerms }).href" target="_blank" class="page-main-rules__link"
          >правила пользования сервисом</a
        >
      </div>
    </main>
  </page-layout>
</template>

<script lang="ts" src="./order-new.ts"></script>
<style src="./order-new.css"></style>
