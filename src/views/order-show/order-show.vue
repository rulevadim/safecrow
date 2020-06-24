<template>
  <page-layout>
    <main
      v-if="orderData"
      class="page-main page-main_order-show"
      :class="{ 'page-main_order-show_auth': status === $orderStatus.NEW && !isOwner }"
    >
      <div class="page-main__title">Сделка №{{ $orderHelper.computeOrderOID(orderData.order) }}</div>

      <!-- === -->
      <!-- NEW -->
      <!-- === -->
      <template v-if="status === $orderStatus.NEW">
        <status-badge color="warning">Ожидает подтверждения</status-badge>
        <!-- Person who created a deal -->
        <template v-if="isOwner">
          <div v-if="isConsumer" class="order-show-status-help">
            <!-- Creator is Consumer -->
            Направьте ссылку второй стороне. Как только Исполнитель подтвердит Сделку, вы&nbsp;сможете перейти
            к&nbsp;оплате.
          </div>
          <div v-else class="order-show-status-help">
            <!-- Creator is Supplier -->
            Направьте ссылку второй стороне. Как только Заказчик подтвердит Сделку, у&nbsp;него появится возможность
            перейти к&nbsp;оплате.
          </div>
          <div class="form-group order-show-link">
            <div
              class="order-show-link__hint"
              :class="showCopyHint ? 'order-show-link__hint_active' : 'order-show-link__hint_disable'"
            >
              Ссылка на Сделку была скопирована
            </div>
            <input
              ref="linkInput"
              v-model="link"
              type="text"
              class="form-group__input input form-group__input_link"
              readonly
            />
            <button class="order-show-link__btn" @click="copyLink">
              <icon-base icon-name="copy" :width="24" :height="24" view-box="0 0 24 24">
                <icon-copy />
              </icon-base>
            </button>
          </div>
        </template>
        <!-- Person who will confirm a deal -->
        <template v-else>
          <div class="order-show-status-help">
            Пожалуйста, ознакомьтесь с&nbsp;деталями Сделки и&nbsp;подтвердите&nbsp;её.
          </div>
          <template v-if="isLoggedIn">
            <button
              :disabled="confirmationRequestInProgress"
              class="btn btn_primary btn_submit order-show__submit-btn order-show__submit-btn_form"
              @click="onConfirmClick"
            >
              Подтвердить
            </button>
            <div class="page-main-rules">
              Нажимая на кнопку «Подтвердить», Вы принимаете
              <a
                :href="$router.resolve({ name: $routesNames.orderTerms }).href"
                target="_blank"
                class="page-main-rules__link"
                >правила пользования сервисом</a
              >.
            </div>
          </template>
        </template>
      </template>

      <!-- =============== -->
      <!-- ORDER_CONFIRMED -->
      <!-- =============== -->
      <template v-if="status === $orderStatus.ORDER_CONFIRMED">
        <status-badge color="danger">Ожидает оплаты</status-badge>
        <!-- ORDER_CONFIRMED Consumer -->
        <template v-if="isConsumer">
          <template v-if="isRequisitesExists">
            <div v-if="isOwner" class="order-show-status-help">
              <!-- If Consumer created a deal -->
              Исполнитель подтвердил Сделку. Получите счет и&nbsp;можете приступать к&nbsp;оплате. Как только Ваш платёж
              поступит на&nbsp;счет сервиса, Исполнитель сможет начать выполнение обязательств по&nbsp;Сделке.
            </div>
            <div v-else class="order-show-status-help">
              <!-- If Supplier created a deal -->
              Вы&nbsp;подтвердили Сделку. Пожалуйста, получите счет и&nbsp;можете приступать к&nbsp;оплате. Как только
              Ваш платёж поступит на&nbsp;счет сервиса, Исполнитель сможет начать выполнение обязательств
              по&nbsp;Сделке.
            </div>
            <button
              :disabled="vueAppPartner === 'alfabank-ru' || invoiceTimerInterval"
              class="btn btn_primary btn_submit order-show__submit-btn createDeal"
              @click="downloadInvoice"
            >
              Получить счет
              <div v-if="vueAppPartner === 'alfabank-ru'" class="warn">
                Уважаемые пользователи, по&nbsp;техническим причинам создание сделок сейчас невозможно. Все ранее
                созданные сделки будут проведены в&nbsp;штатном режиме. Приносим извинения за&nbsp;доставленные
                неудобства.
              </div>
            </button>
            <span v-if="invoiceTimerInterval"> (вы снова сможете получить счет через {{ invoiceTimer }} сек.) </span>
          </template>
          <!-- No requisites -->
          <div v-else class="order-show-status-help order-show-status-help_color">
            Для формирования счёта необходимы реквизиты вашей компании. Пожалуйста, заполните форму в&nbsp;разделе
            <router-link :to="{ name: $routesNames.requisites }" class="btn btn_link order-show-status-help_link"
              >&laquo;Мои реквизиты&raquo;</router-link
            >
            и&nbsp;вы&nbsp;сможете вернуться к&nbsp;оплате.
          </div>
        </template>
        <!-- ORDER_CONFIRMED Supplier -->
        <template v-else>
          <div v-if="isOwner" class="order-show-status-help">
            <!-- If Supplier created a deal -->
            Заказчик подтвердил Сделку. После того, как она будет оплачена Заказчиком, вы&nbsp;сможете приступить
            к&nbsp;выполнению своих обязательств.
          </div>
          <div v-else class="order-show-status-help">
            <!-- If Consumer created a deal -->
            Вы&nbsp;подтвердили Сделку. После того, как она будет оплачена Заказчиком, Вы&nbsp;сможете приступить
            к&nbsp;выполнению своих обязательств по&nbsp;Сделке.
          </div>
        </template>
      </template>

      <!-- ========== -->
      <!-- ORDER_PAID -->
      <!-- ========== -->
      <template v-if="status === $orderStatus.ORDER_PAID">
        <status-badge color="success">Оплата принята</status-badge>
        <!-- ORDER_PAID Consumer -->
        <div v-if="isConsumer" class="order-show-status-help">
          Ваш платёж по&nbsp;Сделке поступил на&nbsp;счет Сервиса. Мы&nbsp;также проинформировали об&nbsp;этом
          Исполнителя и&nbsp;в&nbsp;ближайшее время он&nbsp;приступит к&nbsp;исполнению обязательств по&nbsp;Сделке.
        </div>
        <!-- ORDER_PAID Supplier -->
        <template v-else>
          <template v-if="isRequisitesExists">
            <div class="order-show-status-help">
              <p>
                Платеж Заказчика поступил на&nbsp;счет сервиса. Пожалуйста, приступайте к&nbsp;выполнению обязательств
                по&nbsp;Сделке.
              </p>
              <p>
                По&nbsp;окончании, пожалуйста, укажите свои реквизиты для выплаты и&nbsp;подтвердите, что ваш платеж
                следует направить по&nbsp;ним, после этого подтвердите выполнение нажав кнопку
                &laquo;Заказ&nbsp;выполнен&raquo;.
              </p>
            </div>
            <h2>Подтвердите выбор платежного метода</h2>
            <BankReqsSelector
              :reqs="requisitesData.bank_requisites"
              @confirm="onConfirmBankRequisite"
              @unconfirmed="onUnconfirmedBankRequisite"
            />
            <button
              class="btn btn_primary btn_submit order-show__submit-btn"
              :disabled="!enableWorkIsDoneBtn"
              @click="workIsDoneBtnHandler"
            >
              Заказ выполнен
            </button>
          </template>
          <!-- No requisites -->
          <div v-else class="order-show-status-help">
            Пожалуйста, укажите
            <router-link :to="{ name: $routesNames.requisites }">свои реквизиты</router-link>, это необходимо для
            выплаты вашего вознаграждения по&nbsp;сделке. После внесения реквизитов вы&nbsp;сможете подтвердить
            выполнение заказа.
          </div>
        </template>
      </template>

      <!-- ============ -->
      <!-- WORK_IS_DONE -->
      <!-- ============ -->
      <template v-if="status === $orderStatus.WORK_IS_DONE && !claimFormShown">
        <status-badge color="success">Заказ выполнен</status-badge>
        <!-- WORK_IS_DONE Consumer -->
        <template v-if="isConsumer">
          <div class="order-show-status-help">
            <p>
              Исполнитель подтвердил, что выполнил свои обязательства по&nbsp;Сделке. Пожалуйста, проверьте результат
              работы Исполнителя на&nbsp;соответствие условиям Сделки.
            </p>
            <p>
              Нажмите &laquo;Принять&nbsp;работу&raquo;, если вы&nbsp;довольны результатом Сделки или &laquo;Открыть
              претензию&raquo;, если вы&nbsp;хотите подключить к&nbsp;решению по&nbsp;Сделке Арбитражную команду.
            </p>
          </div>
          <div class="order-show-buttons">
            <button
              class="btn btn_success btn_submit order-show__submit-btn order-show__submit-btn_pair"
              @click="setOrderWorkAccepted"
            >
              Принять работу
            </button>
            <button
              class="btn btn_danger btn_no-border btn_submit order-show__submit-btn order-show__submit-btn_pair"
              @click="toggleClaimForm"
            >
              Открыть претензию
            </button>
          </div>
        </template>
        <!-- WORK_IS_DONE Supplier -->
        <div v-else class="order-show-status-help">
          Вы&nbsp;подтвердили выполнение Заказа по&nbsp;Сделке. Как только Заказчик подтвердит получение
          и&nbsp;соответствие Заказа условиям Сделки, на&nbsp;ваш счёт будет произведена выплата.
        </div>
      </template>

      <!-- ========================== -->
      <!-- WORK_IS_DONE Claim opening -->
      <!-- ========================== -->
      <template v-if="status === $orderStatus.WORK_IS_DONE && claimFormShown">
        <div class="page-main__title page-main__title_order-show">Открыть претензию</div>
        <div class="form-group">
          <textarea
            v-model="claimData.description"
            rows="9"
            class="form-group__input textarea order-show__textarea"
            placeholder="Опишите суть претензии"
          ></textarea>
        </div>
        <file-upload-input
          v-model="claimDataFileIds"
          :allowed-file-mime-types="allowedFileMimeTypes"
          :multiple="true"
          @uploading-start="uploadingInProgress = true"
          @uploading-end="uploadingInProgress = false"
        >
          <template v-slot:title>
            <span class="order-show__file-btn__text">
              Прикрепите файлы, подтверждающие вашу претензию (PGF,&nbsp;JPG,&nbsp;PNG)
            </span>
          </template>
          <template v-slot:file-item="{ item, itemStatus }">
            <div :key="item.key" class="order-show-form__claim-file__item">
              <button type="button" class="btn btn_link btn_no-border" @click="item.openFile">
                {{ item.file.name }}
              </button>
              ({{ itemStatus }})
              <button
                type="button"
                class="btn btn_danger btn_icon btn_no-border order-show-form__claim-file__item__delete-btn"
                @click="item.cancelUpload"
              >
                {{ item.id ? 'Удалить' : 'Отменить' }}
              </button>
            </div>
          </template>
        </file-upload-input>

        <div class="order-show-buttons">
          <button
            class="btn btn_danger btn_no-border btn_submit order-show__submit-btn order-show__submit-btn_pair"
            @click="toggleClaimForm"
          >
            Отменить
          </button>
          <button
            :disabled="uploadingInProgress || !isClaimFormValid"
            class="btn btn_success btn_submit order-show__submit-btn order-show__submit-btn_pair"
            @click="onSubmitClaimData"
          >
            Открыть претензию
          </button>
        </div>
      </template>

      <!-- ============= -->
      <!-- WORK_ACCEPTED -->
      <!-- ============= -->
      <template v-if="status === $orderStatus.WORK_ACCEPTED">
        <status-badge color="success">Работа принята</status-badge>
        <!-- WORK_ACCEPTED Consumer -->
        <div v-if="isConsumer" class="order-show-status-help">
          Вы&nbsp;приняли результат работы Исполнителя. В&nbsp;ближайшее время будет сформировано платёжное поручение
          и&nbsp;платёж по&nbsp;Сделке будет направлен Исполнителю.
        </div>
        <!-- WORK_ACCEPTED Supplier -->
        <div v-else class="order-show-status-help">
          Ваша работа была принята Заказчиком. В&nbsp;ближайшее время будет сформировано платёжное поручение
          и&nbsp;платёж по&nbsp;Сделке будет направлен на&nbsp;ваш рассчетный счёт.
        </div>
      </template>

      <!-- =========== -->
      <!-- PAYOUT_DONE -->
      <!-- =========== -->
      <template v-if="status === $orderStatus.PAYOUT_DONE">
        <status-badge color="danger">Ожидает подтверждения выплаты</status-badge>
        <!-- PAYOUT_DONE Consumer -->
        <div v-if="isConsumer" class="order-show-status-help">
          Платёж по&nbsp;Сделке был направлен на&nbsp;указанный Исполнителем рассчётный счет. После подтверждения
          получения средств Исполнителем Сделка будет закрыта.
        </div>
        <!-- PAYOUT_DONE Supplier -->
        <template v-else>
          <div class="order-show-status-help">
            Платёж по&nbsp;Сделке был направлен на&nbsp;указанный вами рассчётный счёт. Пожалуйста, подтвердите
            получение средств. После подтверждения Сделка будет закрыта. В&nbsp;случае, если спустя 3&nbsp;банковских
            дня после перевода вы&nbsp;не&nbsp;подтвердите получение средств, Сделка будет закрыта автоматически.
          </div>
          <button class="btn btn_primary btn_submit order-show__submit-btn" @click="setOrderPayoutConfirmed">
            Подтвердить выплату
          </button>
        </template>
      </template>

      <!-- ================ -->
      <!-- PAYOUT_CONFIRMED -->
      <!-- ================ -->
      <template v-if="status === $orderStatus.PAYOUT_CONFIRMED">
        <status-badge color="success">Сделка закрыта</status-badge>
        <!-- PAYOUT_CONFIRMED Consumer -->
        <div v-if="isConsumer" class="order-show-status-help">
          Исполнитель подтвердил получение платежа по&nbsp;Сделке. Спасибо, что воспользовались нашим сервисом!
        </div>
        <!-- PAYOUT_CONFIRMED Supplier -->
        <div v-else class="order-show-status-help">
          Спасибо, что воспользовались нашим сервисом.
        </div>
        <router-link
          :to="{ name: $routesNames.orderNew }"
          class="btn btn_primary btn_submit order-show__submit-btn"
          @click.native="createNewDealBtnClickHandler"
        >
          Создать новую Сделку
        </router-link>
      </template>

      <!-- ========== -->
      <!-- CLAIM_OPEN -->
      <!-- ========== -->
      <template v-if="status === $orderStatus.CLAIM_OPEN">
        <status-badge color="danger">Открыта претензия</status-badge>
        <div v-if="isConsumer" class="order-show-status-help">
          Ваша претензия принята. В&nbsp;ближайшее время с&nbsp;вами свяжутся специалисты службы Арбитража для
          урегулирования спора по&nbsp;Сделке.
        </div>
        <div v-else class="order-show-status-help">
          Заказчик открыл претензию. В&nbsp;ближайшее время с&nbsp;вами свяжутся специалисты службы Арбитража для
          урегулирования спора по&nbsp;Сделке.
        </div>
      </template>

      <!-- =============== -->
      <!-- ORDER_CANCELED -->
      <!-- =============== -->
      <template v-if="status === $orderStatus.ORDER_CANCELED">
        <status-badge color="danger">Сделка отменена</status-badge>
        <div v-if="isConsumer" class="order-show-status-help">
          Сделка была отменена. В&nbsp;ближайшее время будет сформировано платёжное поручение на&nbsp;возврат. Средства
          будут возвращены на&nbsp;тот&nbsp;же счёт, с&nbsp;которого вы&nbsp;произвели оплату Сделки.
        </div>
        <div v-else class="order-show-status-help">
          Сделка была отменена. Средства по&nbsp;Сделке возвращены Заказчику.
        </div>
      </template>

      <div class="page-main__title">Информация о Сделке</div>
      <table class="table-info">
        <tr>
          <td>Описание:</td>
          <td>{{ orderData.order.contract_subject }}</td>
        </tr>
        <tr>
          <td>Номер договора:</td>
          <td>{{ orderData.order.contract_number }}</td>
        </tr>
        <tr>
          <td>Дата договора:</td>
          <td>{{ orderData.order.contract_date }}</td>
        </tr>
        <tr>
          <td>Файлы договора:</td>
          <td>
            <template v-if="Array.isArray(orderData.files)">
              <div v-for="file in orderData.files" :key="file.file_id">
                <a :href="getFileDownloadLink(file)" download>
                  {{ file.name }}
                </a>
              </div>
            </template>
            <template v-else>
              Нет файлов.
            </template>
          </td>
        </tr>

        <!-- CLAIM_OPEN -->
        <template v-if="status === $orderStatus.CLAIM_OPEN && orderClaimData">
          <tr>
            <td>Описание претензии:</td>
            <td>{{ orderClaimData.description }}</td>
          </tr>
          <tr>
            <td>Файлы по претензии:</td>
            <td>
              <template v-if="Array.isArray(orderClaimData.files)">
                <div v-for="file in orderClaimData.files" :key="file.file_id">
                  <a v-if="isLoggedIn" :href="getClaimFileDownloadLink(file)" download>
                    {{ file.name }}
                  </a>
                  <template v-else>{{ file.name }}</template>
                </div>
              </template>
              <template v-else>
                Нет файлов.
              </template>
            </td>
          </tr>
        </template>
      </table>

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
                <td>{{ (orderData.cost.cost || 0) | price }}</td>
              </tr>
              <tr>
                <td>Защита Сделки</td>
                <td class="table__dots"></td>
                <td>{{ (orderData.cost.consumer_commission || 0) | price }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Итого к&nbsp;оплате:</td>
                <td class="table__dots"></td>
                <td>{{ (orderData.cost.pay_consumer || 0) | price }}</td>
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
                <td>{{ (orderData.cost.cost || 0) | price }}</td>
              </tr>
              <tr>
                <td>Защита Сделки</td>
                <td class="table__dots"></td>
                <td>{{ (orderData.cost.supplier_commission || 0) | price }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>Исполнитель получит:</td>
                <td class="table__dots"></td>
                <td>{{ (orderData.cost.receive_supplier || 0) | price }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div class="page-main__title">Информация об&nbsp;участниках</div>
      <div class="tables">
        <div class="table-wrapper">
          <table class="table table_members">
            <thead>
              <tr>
                <th colspan="2">
                  <div>
                    <span class="table__title">Данные Заказчика</span>
                    <router-link
                      v-if="isConsumer"
                      tag="button"
                      :to="{ name: $routesNames.requisites }"
                      class="btn btn_primary btn_edit"
                    >
                      <font-awesome-icon :icon="['far', 'edit']" /> Изменить
                    </router-link>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Организация:</td>
                <td>{{ memberInfo.consumer.company_name }}</td>
              </tr>
              <tr>
                <td>Должность:</td>
                <td>{{ memberInfo.consumer.contact_user_position }}</td>
              </tr>
              <tr>
                <td>Имя:</td>
                <td>{{ memberInfo.consumer.contact_user_fio }}</td>
              </tr>
              <tr>
                <td>Телефон:</td>
                <td>{{ memberInfo.consumer.contact_user_phone }}</td>
              </tr>
              <tr>
                <td>E-mail:</td>
                <td>{{ memberInfo.consumer.contact_user_email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-wrapper">
          <table class="table table_members">
            <thead>
              <tr>
                <th colspan="2">
                  <div>
                    <span class="table__title">Данные Исполнителя</span>
                    <router-link
                      v-if="isSupplier"
                      tag="button"
                      :to="{ name: $routesNames.requisites }"
                      class="btn btn_primary btn_edit"
                    >
                      <font-awesome-icon :icon="['far', 'edit']" /> Изменить
                    </router-link>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Организация:</td>
                <td>{{ memberInfo.supplier.company_name }}</td>
              </tr>
              <tr>
                <td>Должность:</td>
                <td>{{ memberInfo.supplier.contact_user_position }}</td>
              </tr>
              <tr>
                <td>Имя:</td>
                <td>{{ memberInfo.supplier.contact_user_fio }}</td>
              </tr>
              <tr>
                <td>Телефон:</td>
                <td>{{ memberInfo.supplier.contact_user_phone }}</td>
              </tr>
              <tr>
                <td>E-mail:</td>
                <td>{{ memberInfo.supplier.contact_user_email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <template v-if="orderData.status_history && orderData.status_history.length">
        <div class="page-main__title">История Сделки</div>
        <div class="table-wrapper table-wrapper_history">
          <table class="table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in orderData.status_history" :key="row.created_at">
                <td>
                  {{ new Date(row.created_at).toLocaleDateString() }}
                </td>
                <td>
                  <status-comp :status="row.status" :is-consumer="isConsumer" :is-supplier="isSupplier" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- NEW | Confirmation -->
      <template v-if="status === $orderStatus.NEW && !isOwner">
        <div class="page-main__title">Подтверждение Сделки</div>
        <login-form
          v-show="!isLoggedIn"
          class="order-show-form"
          :redirect-path="$route.path"
          :is-need-redirect-after-login="false"
          @register-by-email-success="onRegisterByEmailSuccess"
          @login-success="onLoginSuccess"
        ></login-form>
        <template v-if="isLoggedIn">
          <button
            :disabled="confirmationRequestInProgress"
            class="btn btn_primary btn_submit order-show__submit-btn order-show__submit-btn_form"
            @click="onConfirmClick"
          >
            Подтвердить
          </button>
          <div class="page-main-rules">
            Нажимая на кнопку «Подтвердить», Вы принимаете
            <a
              :href="$router.resolve({ name: $routesNames.orderTerms }).href"
              target="_blank"
              class="page-main-rules__link"
              >правила пользования сервисом</a
            >.
          </div>
        </template>
      </template>
    </main>
  </page-layout>
</template>

<script lang="ts" src="./order-show.ts"></script>
<style src="./order-show.css"></style>
