<template>
  <div v-if="isOpenRuPartner">
    <button
      class="btn btn_primary login-form__oauth-btn"
      :disabled="loginWithOpenRuInProgress"
      @click="loginWithOpenRu"
    >
      <span class="login-form__oauth-btn__text">
        Войти через
      </span>
      <img :src="pathToLogo" alt="logo" width="126" height="32" />
    </button>
  </div>
  <form v-else class="login-form" @submit.prevent="onSubmitFormData">
    <div class="login-form__inputs-wrapper">
      <template v-if="isLoginByPhone">
        <form class="form-group" @submit.prevent>
          <label class="form-group__label" for="phone">Номер телефона</label>
          <input
            id="phone"
            v-model="loginByPhoneData.phone"
            v-phone-mask="'+7 (###) ### ## ##'"
            name="phone"
            type="text"
            placeholder="+7 (___) ___ __ __"
            class="form-group__input input input_login-phone"
            :disabled="disabled"
          />
          <div v-if="disabled" class="form-group__error">
            Пожалуйста, проверьте корректность всех указанных данных
          </div>
          <div
            v-if="isRegisterByPhoneSuccess && disableRegisterByPhoneButtonTimerChangeInterval"
            class="login-form-group__help"
          >
            На&nbsp;указанный телефон было направлено СМС, содержащее код. Для&nbsp;авторизации в&nbsp;сервисе,
            пожалуйста, введите код из&nbsp;СМС.
          </div>
          <button
            v-if="loginByPhoneData.phone.length > 4"
            :disabled="!(isValidPhoneNumber && !disableRegisterByPhoneButtonTimerChangeInterval)"
            class="btn btn_link login-form-group__code-btn"
            type="submit"
            @click="registerByPhone"
          >
            Получить код
          </button>
          <div
            v-if="disableRegisterByPhoneButtonTimerChangeInterval"
            class="login-form-group__help_new login-form-group__help_new-code"
          >
            (вы снова сможете получить код через {{ disableRegisterByPhoneButtonTimer }} сек.)
          </div>
        </form>

        <div v-show="isRegisterByPhoneSuccess" class="form-group">
          <label class="form-group__label" for="code">Код из СМС</label>
          <masked-input
            id="code"
            ref="phoneDataCodeInput"
            v-model="loginByPhoneData.code"
            class="input form-group__input login-form__input_code"
            name="code"
            type="text"
            :mask="maskPhoneCode"
            placeholder_="______"
            placeholder-char=" "
            autocomplete="off"
          />
          <p v-if="loginByPhoneErrors.code" class="login-form-group__error">
            {{ loginByPhoneErrors.code }}
          </p>
        </div>
      </template>

      <template v-if="vueAppPartner === ''">
        <div v-if="isLoginByEmail && isLoginByPhone" class="login-form-splitter">
          Или
        </div>

        <template v-if="isLoginByEmail">
          <div class="form-group">
            <label class="form-group__label" for="email">E-mail</label>
            <input
              id="email"
              v-model="loginByEmailData.email"
              class="form-group__input input"
              name="email"
              type="email"
              placeholder="Адрес электронной почты"
            />
            <div v-if="isRegisterByEmailSuccess" class="login-form-group__help">
              На&nbsp;указанный e-mail было направлено письмо, содержащее ссылку. Для&nbsp;авторизации в&nbsp;сервисе,
              пожалуйста, перейдите по&nbsp;ссылке из&nbsp;письма.
            </div>
          </div>
        </template>
      </template>
    </div>

    <button
      v-show="createDeal || loginByEmailData.email.length || isRegisterByPhoneSuccess"
      :disabled="
        (vueAppPartner === 'alfabank-ru' && createDeal) ||
        uploadingInProgress ||
        !isLoginFormValid ||
        (isLoginByPhone && !registerToken) ||
        registerInProgress ||
        loginInProgress
      "
      class="btn btn_primary btn_submit login-form__submit-btn createDeal"
      type="submit"
    >
      <template v-if="vueAppPartner === 'alfabank-ru' && createDeal">
        <div class="warn">
          Уважаемые пользователи, по&nbsp;техническим причинам создание сделок сейчас невозможно. Все ранее созданные
          сделки будут проведены в&nbsp;штатном режиме. Приносим извинения за&nbsp;доставленные неудобства.
        </div>
      </template>
      <template v-if="createDeal">
        Создать Сделку
        <font-awesome-icon v-if="uploadingInProgress" icon="sync" spin class="login-form__submit-btn-icon" />
      </template>
      <template v-else>
        Войти
      </template>
    </button>
  </form>
</template>

<script lang="ts" src="./login-form.ts"></script>
<style src="./login-form.css"></style>
