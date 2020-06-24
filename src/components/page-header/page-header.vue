<template>
  <header class="page-header">
    <div class="warning__header" v-if="showWarning">
      <span>
        Уважаемые пользователи! Информируем вас об&nbsp;ограничении переводов между банковскими счетами
        на&nbsp;праздниках.
        <button type="button" class="warning__more" @click="showModal = true">Подробнее...</button>
      </span>
    </div>

    <div class="warning-modal" v-if="showModal">
      <div class="warning">
        <button type="button" class="warning__close" @click="showModal = false">
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="times"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
            class="svg-inline--fa fa-times fa-w-11 warning__close"
            style="width: 100%; height: 100%;"
          >
            <path
              fill="currentColor"
              d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
            ></path>
          </svg>
        </button>
        <p class="warning__text">
          Уважаемые пользователи сервиса SafeCrow, обращаем Ваше внимание, что в&nbsp;связи с&nbsp;майскими праздниками
          денежные переводы между банковскими расчетными счетами не&nbsp;будут осуществляться с&nbsp;1&nbsp;мая
          по&nbsp;5&nbsp;мая 2020 года и&nbsp;с&nbsp;9&nbsp;мая по&nbsp;11&nbsp;мая 2020. Выплаты по&nbsp;расчетным
          счетам будут проводиться с&nbsp;6&nbsp;мая по&nbsp;8&nbsp;мая, а&nbsp;затем будут возобновлены в&nbsp;штатном
          режиме, начиная с&nbsp;12&nbsp;мая 2020&nbsp;года. В&nbsp;праздничный период мы&nbsp;рекомендуем оплачивать
          сделки банковской картой.
        </p>
      </div>
    </div>

    <div
      class="page-header__links-wrapper"
      :class="{ 'page-header__links-wrapper_color': isNotXlBreakpoint && !linksListClosed }"
    >
      <div v-if="isNotXlBreakpoint" class="container page-header__row page-header__row_not_xl">
        <template v-if="isLoggedIn">
          <button class="btn btn_link btn_icon btn_icon_header" @click="toggleLinksList">
            <icon-base v-if="linksListClosed" icon-name="burger" :width="48" :height="48" view-box="0 0 64 64">
              <icon-burger />
            </icon-base>
            <icon-base v-else icon-name="cross" :width="48" :height="48" view-box="5 0 64 64">
              <icon-cross />
            </icon-base>
          </button>
          <button class="page-header__link page-header__link_logout btn btn_header_login" @click="logoutAction">
            Выйти
          </button>
        </template>
        <template v-else>
          <router-link
            exact-active-class="page-header__link_color-active"
            class="page-header__link page-header__link_color"
            :to="{ name: $routesNames.orderTerms }"
          >
            О сервисе
          </router-link>
          <router-link
            v-if="!($route.name === $routesNames.authLogin)"
            exact-active-class="page-header__link_color-active"
            class="page-header__link page-header__link_login btn btn_header_login"
            :to="loginRoute"
          >
            Войти
          </router-link>
        </template>
      </div>
      <template v-if="!linksListClosed || !isNotXlBreakpoint">
        <div v-if="isNotXlBreakpoint" class="page-header__splitter page-header__splitter_color"></div>
        <div
          class="container page-header__row page-header__row_xl"
          :class="{ 'page-header__row_color': isNotXlBreakpoint && !linksListClosed }"
        >
          <ul class="page-header__links-list" :class="{ 'page-header__links-list_col': isNotXlBreakpoint }">
            <template v-if="isLoggedIn">
              <li class="page-header__links-list__item">
                <router-link
                  exact-active-class="page-header__link_color-active"
                  class="page-header__link page-header__link_color"
                  :to="{ name: $routesNames.orders }"
                >
                  Мои Сделки
                </router-link>
              </li>
              <li class="page-header__links-list__item">
                <router-link
                  exact-active-class="page-header__link_color-active"
                  class="page-header__link page-header__link_color"
                  :to="{ name: $routesNames.requisites }"
                >
                  Мои реквизиты
                </router-link>
              </li>
              <li class="page-header__links-list__item">
                <router-link
                  exact-active-class="page-header__link_color-active"
                  class="page-header__link page-header__link_color"
                  :to="{ name: $routesNames.orderNew }"
                >
                  Создать Сделку
                </router-link>
              </li>
              <li class="page-header__links-list__item">
                <router-link
                  exact-active-class="page-header__link_color-active"
                  class="page-header__link page-header__link_color"
                  :to="{ name: $routesNames.orderTerms }"
                >
                  О сервисе
                </router-link>
              </li>
              <li v-if="!isNotXlBreakpoint" class="page-header__links-list__item page-header__links-list__item_logout">
                <button class="page-header__link page-header__link_logout btn btn_header_login" @click="logoutAction">
                  Выйти
                </button>
              </li>
            </template>
            <template v-else-if="!isNotXlBreakpoint">
              <li class="page-header__links-list__item">
                <router-link
                  exact-active-class="page-header__link_color-active"
                  class="page-header__link page-header__link_color"
                  :to="{ name: $routesNames.orderTerms }"
                >
                  О сервисе
                </router-link>
              </li>
              <li
                v-if="!($route.name === $routesNames.authLogin)"
                class="page-header__links-list__item page-header__links-list__item_logout"
              >
                <router-link
                  exact-active-class="page-header__link_color-active"
                  class="page-header__link page-header__link_login btn btn_header_login"
                  :to="loginRoute"
                >
                  Войти
                </router-link>
              </li>
            </template>
          </ul>
        </div>
      </template>
    </div>
    <div class="page-header__partner-wrapper">
      <div class="container page-header__partner">
        <div class="page-header__partner-back">
          <icon-base icon-name="arrow-back" :width="24" :height="24" view-box="0 0 24 24">
            <icon-arrow-back />
          </icon-base>
          <a class="page-header__partner-back__link" :href="partnerData.linkURL">
            Вернуться на {{ partnerData.linkText }}
          </a>
        </div>
        <div class="page-header__partner-logo">
          <a class="page-header__partner-back__link" :href="partnerData.linkURL">
            <img class="page-header__partner-logo-img" :src="pathToLogo" alt="logo" />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script src="./page-header.ts" lang="ts"></script>
<style src="./page-header.css"></style>
