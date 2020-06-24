<template>
  <page-layout>
    <main class="page-main page-main__padding-rignt-0">
      <!-- ЮР.ЛИЦО -->
      <template v-if="isLegal">
        <!-- Информация о компании -->
        <div class="requisites-page-title-wrapper">
          <div class="page-main__title page-main__title_m-0">Информация о&nbsp;компании</div>
          <div class="requisites-data-edit-form-wrapper">
            <button
              v-if="showEditCompanyInfo"
              class="btn btn_primary btn_edit"
              form="company-info"
              :disabled="!isCompanyInfoValid"
              @click="saveCompanyInfo"
            >
              <font-awesome-icon v-if="loadIcon.company_info" icon="sync" spin />
              <font-awesome-icon v-else :icon="['far', 'save']" class="icon" />
              Сохранить
            </button>
            <button v-else class="btn btn_primary btn_edit" @click="editCompanyInfo">
              <font-awesome-icon :icon="['far', 'edit']" class="icon" />
              Редактировать
            </button>
          </div>
        </div>
        <template v-if="showEditCompanyInfo">
          <div class="form-group form-group_suggestions form-group_suggestions_company">
            <label class="form-group__label" for="searchCompany">Поиск по компаниям</label>
            <input
              id="searchCompany"
              v-model="searchCompany"
              class="form-group__input input"
              placeholder="Название, ИНН, ОГРН или адрес организации"
              @focus="searchCompanyFocus = true"
              @blur="searchCompanyFocus = false"
            />
            <transition name="suggestions">
              <ul v-show="showCompanySuggestions" class="suggestions" :style="`height: ${companySuggestionsHeight}`">
                <li
                  v-for="suggestion in suggestionsCompany"
                  :key="suggestion.inn"
                  class="suggestions__item"
                  @click="selectCompanySuggestion(suggestion)"
                >
                  <div class="suggestions__company-name">
                    {{ suggestion.company_name }}
                  </div>
                  <!-- <div class="suggestions__address">{{ suggestion.legal_address }}</div> -->
                </li>
              </ul>
            </transition>

            <div class="requisites-notice">
              При корректном заполнении остальные данные формы заполнятся автоматически
            </div>
          </div>
          <transition name="suggestions">
            <form v-show="hasDataInCompanyInfoForm" id="company-info" class="requisites-form" @submit.prevent>
              <div class="requisites-notice_color">
                Все поля обязательны для заполнения
              </div>
              <div class="form-group">
                <label class="form-group__label" for="company_name">Название организации</label>
                <input
                  id="company_name"
                  v-model="requisites.company_info.company_name"
                  name="company_name"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.company_name.$error }"
                  required
                  readonly
                  placeholder="Введите название"
                  @blur="$v.requisites.company_info.company_name.$touch"
                />
                <div v-if="$v.requisites.company_info.company_name.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.company_name.required">
                    {{ validRules.errors.required }}
                  </template>
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="company_inn">ИНН</label>
                <input
                  id="company_inn"
                  v-model="requisites.company_info.inn"
                  v-numericOnly
                  name="company_inn"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.inn.$error }"
                  :minlength="validRules.length.innMax"
                  :maxlength="validRules.length.innMin"
                  required
                  readonly
                  placeholder="_________________"
                  @blur="$v.requisites.company_info.inn.$touch"
                />
                <div v-if="$v.requisites.company_info.inn.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.inn.required">
                    {{ validRules.errors.required }}
                  </template>
                  <template v-else-if="!$v.requisites.company_info.inn.validFormat">
                    ИНН должен состоять из {{ validRules.length.innMin }} или {{ validRules.length.innMax }} цифр
                  </template>
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="company_kpp">КПП</label>
                <input
                  id="company_kpp"
                  v-model="requisites.company_info.kpp"
                  v-numericOnly
                  name="company_kpp"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.kpp.$error }"
                  :minlength="validRules.length.kpp"
                  :maxlength="validRules.length.kpp"
                  required
                  readonly
                  placeholder="_________________"
                  @blur="$v.requisites.company_info.kpp.$touch"
                />
                <div v-if="$v.requisites.company_info.kpp.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.kpp.validFormat">
                    КПП должен состоять из {{ validRules.length.kpp }} цифр
                  </template>
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="company_ogrn">ОГРН/ОГРНИП</label>
                <input
                  id="company_ogrn"
                  v-model="requisites.company_info.ogrn"
                  v-numericOnly
                  name="company_ogrn"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.ogrn.$error }"
                  required
                  readonly
                  :minlength="validRules.length.ogrnMin"
                  :maxlength="validRules.length.ogrnMax"
                  placeholder="_________________"
                  @blur="$v.requisites.company_info.ogrn.$touch"
                />
                <div v-if="$v.requisites.company_info.ogrn.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.ogrn.required">
                    {{ validRules.errors.required }}
                  </template>
                  <template v-else-if="!$v.requisites.company_info.ogrn.validFormat">
                    ОГРН/ОГРНИП должен состоять из {{ validRules.length.ogrnMin }} или
                    {{ validRules.length.ogrnMax }} цифр
                  </template>
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="company_legal_address">Юридический адрес</label>
                <input
                  id="company_legal_address"
                  v-model="requisites.company_info.legal_address"
                  name="company_legal_address"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.legal_address.$error }"
                  required
                  placeholder="Введите адрес"
                  @blur="$v.requisites.company_info.legal_address.$touch"
                />
                <div v-if="$v.requisites.company_info.legal_address.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.legal_address.required">
                    {{ validRules.errors.required }}
                  </template>
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="company_phisical_address">Фактический адрес</label>
                <input
                  id="company_phisical_address"
                  v-model="requisites.company_info.physical_address"
                  name="company_phisical_address"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.physical_address.$error }"
                  required
                  placeholder="Введите адрес"
                  @blur="$v.requisites.company_info.physical_address.$touch"
                />
                <div v-if="$v.requisites.company_info.physical_address.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.physical_address.required">
                    {{ validRules.errors.required }}
                  </template>
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="chief_user_fio">ФИО руководителя</label>
                <input
                  id="chief_user_fio"
                  v-model="requisites.company_info.chief_user_fio"
                  name="chief_user_fio"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.chief_user_fio.$error }"
                  required
                  placeholder="Фамилия Имя Отчество"
                  @blur="$v.requisites.company_info.chief_user_fio.$touch"
                />
                <div v-if="$v.requisites.company_info.chief_user_fio.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.chief_user_fio.required">
                    {{ validRules.errors.required }}
                  </template>
                  <template v-else-if="!$v.requisites.company_info.chief_user_fio.validFormat">
                    {{ validRules.errors.fio }}
                  </template>
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="chief_user_position">Должность руководителя</label>
                <input
                  id="chief_user_position"
                  v-model="requisites.company_info.chief_user_position"
                  name="chief_user_position"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.chief_user_position.$error }"
                  required
                  placeholder="Должность"
                  @blur="$v.requisites.company_info.chief_user_position.$touch"
                />
                <div v-if="$v.requisites.company_info.chief_user_position.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.chief_user_position.required">
                    {{ validRules.errors.required }}
                  </template>
                  <template v-else-if="!$v.requisites.company_info.chief_user_position.validFormat">
                    {{ validRules.errors.position }}
                  </template>
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="chief_user_basis_for_action">Основание для действия</label>
                <input
                  id="chief_user_basis_for_action"
                  v-model="requisites.company_info.grounds_for_actions"
                  name="chief_user_basis_for_action"
                  class="form-group__input input"
                  :class="{ input_error: $v.requisites.company_info.grounds_for_actions.$error }"
                  required
                  placeholder="Основание для действия"
                  @blur="$v.requisites.company_info.grounds_for_actions.$touch"
                />
                <div v-if="$v.requisites.company_info.grounds_for_actions.$error" class="form-group__error">
                  <template v-if="!$v.requisites.company_info.grounds_for_actions.required">
                    {{ validRules.errors.required }}
                  </template>
                </div>
              </div>
            </form>
          </transition>
        </template>
        <table v-else class="table-info">
          <tr>
            <td>Название организации</td>
            <td>{{ requisites.company_info.company_name }}</td>
          </tr>
          <tr>
            <td>ИНН</td>
            <td>{{ requisites.company_info.inn }}</td>
          </tr>
          <tr>
            <td>КПП</td>
            <td>{{ requisites.company_info.kpp }}</td>
          </tr>
          <tr>
            <td>ОГРН/ОГРНИП</td>
            <td>{{ requisites.company_info.ogrn }}</td>
          </tr>
          <tr>
            <td>Юридический адрес</td>
            <td>{{ requisites.company_info.legal_address }}</td>
          </tr>
          <tr>
            <td>Фактический адрес</td>
            <td>{{ requisites.company_info.physical_address }}</td>
          </tr>
          <tr>
            <td>ФИО руководителя</td>
            <td>{{ requisites.company_info.chief_user_fio }}</td>
          </tr>
          <tr>
            <td>Должность руководителя</td>
            <td>{{ requisites.company_info.chief_user_position }}</td>
          </tr>
          <tr>
            <td>Основание для действия</td>
            <td>{{ requisites.company_info.grounds_for_actions }}</td>
          </tr>
        </table>

        <!-- Банковские реквизиты -->
        <div class="page-main__title">Банковские реквизиты</div>
        <h2 v-if="requisites.bank_requisites.length > 0">Ваши основные реквизиты</h2>
        <template v-for="requisite in requisites.bank_requisites">
          <PaymentMethod
            v-if="requisite.default_detail"
            :key="requisite.requisite_id"
            :name="requisite.detail_name"
            :data="requisite.checking_account"
            :base="requisite.default_detail"
            @base-method="makeBasePaymentMethod(requisite.requisite_id)"
          />
        </template>
        <h2 v-if="requisites.bank_requisites.length > 1">Дополнительные реквизиты</h2>
        <template v-for="requisite in requisites.bank_requisites">
          <PaymentMethod
            v-if="!requisite.default_detail"
            :key="requisite.requisite_id"
            :name="requisite.detail_name"
            :data="requisite.checking_account"
            :base="requisite.default_detail"
            @base-method="makeBasePaymentMethod(requisite.requisite_id)"
          />
        </template>
        <button class="requisites-add-button btn btn_primary" type="button" @click="openModal">
          <font-awesome-icon :icon="['far', 'file-alt']" class="icon" />
          Добавить реквизиты
        </button>

        <!-- Модальное окно -->
        <div v-if="showModal" id="modal" class="modal requisites__modal">
          <div class="requisites__modal-content">
            <div class="page-main__title page-main__title_mt-0">Банковские реквизиты</div>
            <form class="requisites-form" @submit.prevent>
              <div class="requisites-notice_color">
                Все поля обязательны для заполнения
              </div>
              <div class="form-group form-group_suggestions">
                <label class="form-group__label" for="searchBank">БИК</label>
                <input
                  id="searchBank"
                  ref="bic"
                  v-model="searchBank"
                  type="text"
                  class="form-group__input input"
                  :minlength="validRules.length.bic"
                  :maxlength="validRules.length.bic"
                  required
                  placeholder="_________________"
                  @focus="searchBankFocus = true"
                  @blur="searchBankFocus = false"
                />
                <transition name="suggestions">
                  <ul v-show="showBankSuggestions" class="suggestions" :style="`height: ${bankSuggestionsHeight}`">
                    <li
                      v-for="suggestion in suggestionsBank"
                      :key="suggestion.bank_identification_code"
                      class="suggestions__item"
                      @click="selectBankSuggestion(suggestion)"
                    >
                      <div class="suggestions__company-name">{{ suggestion.bank_name }}</div>
                      <!-- <div class="suggestions__address">{{ suggestion.address }}</div> -->
                    </li>
                  </ul>
                </transition>
                <div class="requisites-notice">
                  При корректном заполнении БИК большинство полей в&nbsp;форме заполнятся автоматически
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="detail_name">Название реквизитов</label>
                <input
                  id="detail_name"
                  v-model="newBankRequisites.detail_name"
                  name="detail_name"
                  class="form-group__input input"
                  :class="{ input_error: $v.newBankRequisites.detail_name.$error }"
                  placeholder="Название реквизитов"
                  required
                  @blur="$v.newBankRequisites.detail_name.$touch"
                />
                <div v-if="$v.newBankRequisites.detail_name.$error" class="form-group__error">
                  <template v-if="!$v.newBankRequisites.detail_name.required">
                    {{ validRules.errors.required }}
                  </template>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="bank_name">Банк</label>
                <input
                  id="bank_name"
                  v-model="newBankRequisites.bank_name"
                  name="bank_name"
                  class="form-group__input input"
                  placeholder="Название банка"
                  required
                  readonly
                  @click="focusToBic"
                />
              </div>

              <div class="form-group">
                <label class="form-group__label" for="city">Город</label>
                <input
                  id="city"
                  v-model="newBankRequisites.city"
                  name="city"
                  class="form-group__input input"
                  placeholder="Название города"
                  required
                  readonly
                  @click="focusToBic"
                />
              </div>

              <div class="form-group">
                <label class="form-group__label" for="address">Адрес</label>
                <input
                  id="address"
                  v-model="newBankRequisites.address"
                  name="address"
                  class="form-group__input input"
                  placeholder="_________________"
                  required
                  readonly
                  @click="focusToBic"
                />
              </div>

              <div class="form-group">
                <label class="form-group__label" for="cor-account">Корреспондентский счет</label>
                <input
                  id="cor-account"
                  v-model="newBankRequisites.corr_account"
                  name="cor_account"
                  class="form-group__input input"
                  placeholder="_________________"
                  required
                  readonly
                  @click="focusToBic"
                />
              </div>

              <div class="form-group">
                <label class="form-group__label" for="bank_checking_account">Расчетный счет</label>
                <input
                  id="bank_checking_account"
                  v-model="newBankRequisites.checking_account"
                  v-numericOnly
                  name="bank_checking_account"
                  class="form-group__input input"
                  :class="{ input_error: $v.newBankRequisites.checking_account.$error }"
                  :minlength="validRules.length.bankCheckingAccount"
                  :maxlength="validRules.length.bankCheckingAccount"
                  required
                  placeholder="_________________"
                  @blur="$v.newBankRequisites.checking_account.$touch"
                />
                <div v-if="$v.newBankRequisites.checking_account.$error" class="form-group__error">
                  <template v-if="!$v.newBankRequisites.checking_account.required">
                    {{ validRules.errors.required }}
                  </template>
                  <template v-else-if="!$v.newBankRequisites.checking_account.validLegal">
                    {{ validRules.errors.legal }}
                  </template>
                  <template v-else-if="!$v.newBankRequisites.checking_account.validFormat">
                    {{ validRules.errors.checking }}
                  </template>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn_submit btn_primary requisites__modal-submit-btn"
                :disabled="!isNewBankRequisitesValid"
                @click="addBankRequisites"
              >
                Добавить реквизиты
              </button>
              <button class="btn btn_icon btn_no-border requisites__modal-close-btn" type="button" @click="closeModal">
                <font-awesome-icon icon="times" style="width: 100%; height: 100%;" />
              </button>
            </form>
          </div>
        </div>
        <!-- Модальное окно -->

        <!-- Контактная информация -->
        <div class="requisites-page-title-wrapper">
          <div class="page-main__title page-main__title_m-0">Контактная информация</div>
          <div class="requisites-data-edit-form-wrapper">
            <button
              v-if="showEditContacts"
              class="btn btn_primary btn_edit"
              form="contacts"
              :disabled="!isContactsValid"
              @click="saveContacts"
            >
              <font-awesome-icon v-if="loadIcon.contacts" icon="sync" spin class="icon" />
              <font-awesome-icon v-else :icon="['far', 'save']" class="icon" />
              Сохранить
            </button>
            <button v-else class="btn btn_primary btn_edit" @click="editContacts">
              <font-awesome-icon :icon="['far', 'edit']" class="icon" />
              Редактировать
            </button>
          </div>
        </div>
        <form v-if="showEditContacts" id="contacts" class="requisites-form" @submit.prevent>
          <div class="requisites-notice_color">
            Данные необходимы для коммуникации при возникновении претензий по&nbsp;Сделке
          </div>

          <div class="form-group">
            <label class="form-group__label" for="contact_user_fio">ФИО контактного лица</label>
            <input
              id="contact_user_fio"
              v-model="requisites.contacts.contact_user_fio"
              name="contact_user_fio"
              class="form-group__input input"
              :class="{ input_error: $v.requisites.contacts.contact_user_fio.$error }"
              required
              placeholder="Фамилия Имя Отчество"
              @blur="$v.requisites.contacts.contact_user_fio.$touch"
            />
            <div v-if="$v.requisites.contacts.contact_user_fio.$error" class="form-group__error">
              <template v-if="!$v.requisites.contacts.contact_user_fio.required">
                {{ validRules.errors.required }}
              </template>
              <template v-else-if="!$v.requisites.contacts.contact_user_fio.validFormat">
                {{ validRules.errors.fio }}
              </template>
            </div>
          </div>

          <div class="form-group">
            <label class="form-group__label" for="contact_user_position">Должность</label>
            <input
              id="contact_user_position"
              v-model="requisites.contacts.contact_user_position"
              name="contact_user_position"
              class="form-group__input input"
              :class="{ input_error: $v.requisites.contacts.contact_user_position.$error }"
              required
              placeholder="Введите должность"
              @blur="$v.requisites.contacts.contact_user_position.$touch"
            />
            <div v-if="$v.requisites.contacts.contact_user_position.$error" class="form-group__error">
              <template v-if="!$v.requisites.contacts.contact_user_position.required">
                {{ validRules.errors.required }}
              </template>
              <template v-else-if="!$v.requisites.contacts.contact_user_position.validFormat">
                {{ validRules.errors.position }}
              </template>
            </div>
          </div>

          <div class="form-group">
            <label class="form-group__label" for="phone">Номер телефона</label>
            <input
              id="phone"
              v-model="requisites.contacts.contact_user_phone"
              v-phone-mask="'+7 (###) ### ## ##'"
              name="phone"
              type="text"
              required
              placeholder="+7 (___) ___ __ __"
              class="form-group__input input input_login-phone"
              :class="{ input_error: $v.requisites.contacts.contact_user_phone.$error }"
              @blur="$v.requisites.contacts.contact_user_phone.$touch"
            />
            <div v-if="$v.requisites.contacts.contact_user_phone.$error" class="form-group__error">
              <template v-if="!$v.requisites.contacts.contact_user_phone.required">
                {{ validRules.errors.required }}
              </template>
              <template v-else-if="!$v.requisites.contacts.contact_user_phone.validFormat">
                {{ validRules.errors.phone }}
              </template>
            </div>
          </div>

          <div class="form-group">
            <label class="form-group__label" for="email">Электронная почта</label>
            <input
              id="email"
              v-model="requisites.contacts.contact_user_email"
              type="email"
              name="email"
              class="form-group__input input"
              :class="{ input_error: $v.requisites.contacts.contact_user_email.$error }"
              placeholder="example@mail.com"
              required
              @blur="$v.requisites.contacts.contact_user_email.$touch"
            />
            <div v-if="$v.requisites.contacts.contact_user_email.$error" class="form-group__error">
              <template v-if="!$v.requisites.contacts.contact_user_email.required">
                {{ validRules.errors.required }}
              </template>
              <template v-else-if="!$v.requisites.contacts.contact_user_email.validFormat">
                {{ validRules.errors.mail }}
              </template>
            </div>
          </div>
        </form>
        <table v-else class="table-info">
          <tr>
            <td>ФИО контактного лица</td>
            <td>{{ requisites.contacts.contact_user_fio }}</td>
          </tr>
          <tr>
            <td>Должность</td>
            <td>{{ requisites.contacts.contact_user_position }}</td>
          </tr>
          <tr>
            <td>Номер телефона</td>
            <td>{{ requisites.contacts.contact_user_phone }}</td>
          </tr>
          <tr>
            <td>Электронная почта</td>
            <td>{{ requisites.contacts.contact_user_email }}</td>
          </tr>
        </table>
      </template>

      <!-- ФИЗ.ЛИЦО -->
      <template v-else>
        <!-- ФИЗ.ЛИЦО Информация о пользователе -->
        <div class="requisites-page-title-wrapper">
          <div class="page-main__title page-main__title_m-0">Информация о&nbsp;пользователе</div>
          <div class="requisites-data-edit-form-wrapper">
            <button
              v-if="showEditUserInfo"
              class="btn btn_primary btn_edit"
              form="contacts"
              :disabled="!isContactsIndividualValid"
              @click="saveContacts"
            >
              <font-awesome-icon v-if="loadIcon.contactsIndividual" icon="sync" spin class="icon" />
              <font-awesome-icon v-else :icon="['far', 'save']" class="icon" />
              Сохранить
            </button>
            <button v-else class="btn btn_primary btn_edit" @click="editContacts">
              <font-awesome-icon :icon="['far', 'edit']" class="icon" />
              Редактировать
            </button>
          </div>
        </div>
        <form v-if="showEditContactsIndividual" id="contacts" class="requisites-form" @submit.prevent>
          <div class="form-group">
            <label class="form-group__label" for="phone">Номер телефона</label>
            <input
              id="phone"
              v-model="requisitesIndividual.contacts.phone"
              v-phone-mask="'+7 (###) ### ## ##'"
              name="phone"
              type="text"
              required
              placeholder="+7 (___) ___ __ __"
              class="form-group__input input input_login-phone"
              :class="{ input_error: $v.requisitesIndividual.contacts.phone.$error }"
              @blur="$v.requisitesIndividual.contacts.phone.$touch"
            />
            <div v-if="$v.requisitesIndividual.contacts.phone.$error" class="form-group__error">
              <template v-if="!$v.requisitesIndividual.contacts.phone.required">
                {{ validRules.errors.required }}
              </template>
              <template v-else-if="!$v.requisitesIndividual.contacts.phone.validFormat">
                {{ validRules.errors.phone }}
              </template>
            </div>
          </div>

          <div class="form-group">
            <label class="form-group__label" for="email">Электронная почта</label>
            <input
              id="email"
              v-model="requisitesIndividual.contacts.email"
              type="email"
              name="email"
              class="form-group__input input"
              :class="{ input_error: $v.requisitesIndividual.contacts.email.$error }"
              placeholder="example@mail.com"
              required
              @blur="$v.requisitesIndividual.contacts.email.$touch"
            />
            <div v-if="$v.requisitesIndividual.contacts.email.$error" class="form-group__error">
              <template v-if="!$v.requisitesIndividual.contacts.email.required">
                {{ validRules.errors.required }}
              </template>
              <template v-else-if="!$v.requisitesIndividual.contacts.email.validFormat">
                {{ validRules.errors.mail }}
              </template>
            </div>
          </div>
        </form>
        <table v-else class="table-info">
          <tr>
            <td>Номер телефона</td>
            <td>{{ requisitesIndividual.contacts.phone }}</td>
          </tr>
          <tr>
            <td>Электронная почта</td>
            <td>{{ requisitesIndividual.contacts.email }}</td>
          </tr>
        </table>

        <!-- ФИЗ.ЛИЦО Банковские реквизиты -->
        <div class="page-main__title">Банковские реквизиты</div>
        <h2 v-if="requisitesIndividual.bank_requisites.length > 0">Ваши основные реквизиты</h2>
        <template v-for="requisite in requisitesIndividual.bank_requisites">
          <PaymentMethod
            v-if="requisite.default_detail"
            :key="requisite.requisite_id"
            :name="requisite.detail_name"
            :data="requisite.checking_account"
            :base="requisite.default_detail"
            @base-method="makeBasePaymentMethod(requisite.requisite_id)"
          />
        </template>
        <h2 v-if="requisitesIndividual.bank_requisites.length > 1">Дополнительные реквизиты</h2>
        <template v-for="requisite in requisitesIndividual.bank_requisites">
          <PaymentMethod
            v-if="!requisite.default_detail"
            :key="requisite.requisite_id"
            :name="requisite.detail_name"
            :data="requisite.checking_account"
            :base="requisite.default_detail"
            @base-method="makeBasePaymentMethod(requisite.requisite_id)"
          />
        </template>
        <button class="requisites-add-button btn btn_primary" type="button" @click="openModal">
          <font-awesome-icon :icon="['far', 'file-alt']" class="icon" />
          Добавить реквизиты
        </button>
        <button class="requisites-add-button btn btn_primary" type="button">
          <font-awesome-icon :icon="['far', 'credit-card']" class="icon" />
          Добавить банковскую карту
        </button>

        <!-- ФИЗ.ЛИЦО Модальное окно -->
        <div v-if="showModal" id="modal" class="modal requisites__modal">
          <div class="requisites__modal-content">
            <div class="page-main__title page-main__title_mt-0">Банковские реквизиты</div>
            <form class="requisites-form" @submit.prevent>
              <div class="requisites-notice_color">
                Все поля обязательны для заполнения
              </div>
              <div class="form-group form-group_suggestions">
                <label class="form-group__label" for="searchBank">БИК</label>
                <input
                  id="searchBank"
                  ref="bic"
                  v-model="searchBank"
                  type="text"
                  class="form-group__input input"
                  :minlength="validRules.length.bic"
                  :maxlength="validRules.length.bic"
                  required
                  placeholder="_________________"
                  @focus="searchBankFocus = true"
                  @blur="searchBankFocus = false"
                />
                <transition name="suggestions">
                  <ul v-show="showBankSuggestions" class="suggestions" :style="`height: ${bankSuggestionsHeight}`">
                    <li
                      v-for="suggestion in suggestionsBank"
                      :key="suggestion.bank_identification_code"
                      class="suggestions__item"
                      @click="selectBankSuggestion(suggestion)"
                    >
                      <div class="suggestions__company-name">{{ suggestion.bank_name }}</div>
                      <!-- <div class="suggestions__address">{{ suggestion.address }}</div> -->
                    </li>
                  </ul>
                </transition>
                <div class="requisites-notice">
                  При корректном заполнении БИК большинство полей в&nbsp;форме заполнятся автоматически
                </div>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="detail_name">Название реквизитов</label>
                <input
                  id="detail_name"
                  v-model="newBankRequisites.detail_name"
                  name="detail_name"
                  class="form-group__input input"
                  :class="{ input_error: $v.newBankRequisites.detail_name.$error }"
                  placeholder="Название реквизитов"
                  required
                  @blur="$v.newBankRequisites.detail_name.$touch"
                />
                <div v-if="$v.newBankRequisites.detail_name.$error" class="form-group__error">
                  <template v-if="!$v.newBankRequisites.detail_name.required">
                    {{ validRules.errors.required }}
                  </template>
                </div>
              </div>
              <div class="form-group">
                <label class="form-group__label" for="bank_name">Банк</label>
                <input
                  id="bank_name"
                  v-model="newBankRequisites.bank_name"
                  name="bank_name"
                  class="form-group__input input"
                  placeholder="Название банка"
                  required
                  readonly
                  @click="focusToBic"
                />
              </div>

              <div class="form-group">
                <label class="form-group__label" for="city">Город</label>
                <input
                  id="city"
                  v-model="newBankRequisites.city"
                  name="city"
                  class="form-group__input input"
                  placeholder="Название города"
                  required
                  readonly
                  @click="focusToBic"
                />
              </div>

              <div class="form-group">
                <label class="form-group__label" for="address">Адрес</label>
                <input
                  id="address"
                  v-model="newBankRequisites.address"
                  name="address"
                  class="form-group__input input"
                  placeholder="_________________"
                  required
                  readonly
                  @click="focusToBic"
                />
              </div>

              <div class="form-group">
                <label class="form-group__label" for="cor-account">Корреспондентский счет</label>
                <input
                  id="cor-account"
                  v-model="newBankRequisites.corr_account"
                  name="cor_account"
                  class="form-group__input input"
                  placeholder="_________________"
                  required
                  readonly
                  @click="focusToBic"
                />
              </div>

              <div class="form-group">
                <label class="form-group__label" for="bank_checking_account">Расчетный счет</label>
                <input
                  id="bank_checking_account"
                  v-model="newBankRequisites.checking_account"
                  v-numericOnly
                  name="bank_checking_account"
                  class="form-group__input input"
                  :class="{ input_error: $v.newBankRequisites.checking_account.$error }"
                  :minlength="validRules.length.bankCheckingAccount"
                  :maxlength="validRules.length.bankCheckingAccount"
                  required
                  placeholder="_________________"
                  @blur="$v.newBankRequisites.checking_account.$touch"
                />
                <div v-if="$v.newBankRequisites.checking_account.$error" class="form-group__error">
                  <template v-if="!$v.newBankRequisites.checking_account.required">
                    {{ validRules.errors.required }}
                  </template>
                  <template v-else-if="!$v.newBankRequisites.checking_account.validLegal">
                    {{ validRules.errors.legal }}
                  </template>
                  <template v-else-if="!$v.newBankRequisites.checking_account.validFormat">
                    {{ validRules.errors.checking }}
                  </template>
                </div>
              </div>

              <button
                type="submit"
                class="btn btn_submit btn_primary"
                :disabled="!isNewBankRequisitesValid"
                @click="addBankRequisites"
              >
                Добавить реквизиты
              </button>
              <button class="btn btn_icon btn_no-border requisites__modal-close-btn" type="button" @click="closeModal">
                <font-awesome-icon icon="times" style="width: 100%; height: 100%;" />
              </button>
            </form>
          </div>
        </div>

        <!-- ФИЗ.ЛИЦО Контактная информация -->
        <div class="requisites-page-title-wrapper">
          <div class="page-main__title page-main__title_m-0">Контактная информация</div>
          <div class="requisites-data-edit-form-wrapper">
            <button
              v-if="showEditContactsIndividual"
              class="btn btn_primary btn_edit"
              form="contacts"
              :disabled="!isContactsIndividualValid"
              @click="saveContactsIndividual"
            >
              <font-awesome-icon v-if="loadIcon.contactsIndividual" icon="sync" spin class="icon" />
              <font-awesome-icon v-else :icon="['far', 'save']" class="icon" />
              Сохранить
            </button>
            <button v-else class="btn btn_primary btn_edit" @click="editContactsIndividual">
              <font-awesome-icon :icon="['far', 'edit']" class="icon" />
              Редактировать
            </button>
          </div>
        </div>
        <form v-if="showEditContactsIndividual" id="contacts" class="requisites-form" @submit.prevent>
          <div class="requisites-notice_color">
            Данные необходимы для коммуникации при возникновении претензий по&nbsp;Сделке
          </div>

          <div class="form-group">
            <label class="form-group__label" for="phone">Номер телефона</label>
            <input
              id="phone"
              v-model="requisitesIndividual.contacts.phone"
              v-phone-mask="'+7 (###) ### ## ##'"
              name="phone"
              type="text"
              required
              placeholder="+7 (___) ___ __ __"
              class="form-group__input input input_login-phone"
              :class="{ input_error: $v.requisitesIndividual.contacts.phone.$error }"
              @blur="$v.requisitesIndividual.contacts.phone.$touch"
            />
            <div v-if="$v.requisitesIndividual.contacts.phone.$error" class="form-group__error">
              <template v-if="!$v.requisitesIndividual.contacts.phone.required">
                {{ validRules.errors.required }}
              </template>
              <template v-else-if="!$v.requisitesIndividual.contacts.phone.validFormat">
                {{ validRules.errors.phone }}
              </template>
            </div>
          </div>

          <div class="form-group">
            <label class="form-group__label" for="email">Электронная почта</label>
            <input
              id="email"
              v-model="requisitesIndividual.contacts.email"
              type="email"
              name="email"
              class="form-group__input input"
              :class="{ input_error: $v.requisitesIndividual.contacts.email.$error }"
              placeholder="example@mail.com"
              required
              @blur="$v.requisitesIndividual.contacts.email.$touch"
            />
            <div v-if="$v.requisitesIndividual.contacts.email.$error" class="form-group__error">
              <template v-if="!$v.requisitesIndividual.contacts.email.required">
                {{ validRules.errors.required }}
              </template>
              <template v-else-if="!$v.requisitesIndividual.contacts.email.validFormat">
                {{ validRules.errors.mail }}
              </template>
            </div>
          </div>
        </form>
        <table v-else class="table-info">
          <tr>
            <td>Номер телефона</td>
            <td>{{ requisitesIndividual.contacts.phone }}</td>
          </tr>
          <tr>
            <td>Электронная почта</td>
            <td>{{ requisitesIndividual.contacts.email }}</td>
          </tr>
        </table>
      </template>
    </main>
  </page-layout>
</template>

<script lang="ts" src="./requisites.ts"></script>
<style src="./requisites.css"></style>
