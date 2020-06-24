<template>
  <page-layout>
    <main class="page-main page-main_home">
      <div class="page-main__title page-main__title_home">Создание безопасной Сделки</div>
      <div v-if="false" class="home-notice">Для начала, пожалуйста, выберите тип Сделки</div>
      <router-link class="home-button" :to="{ name: $routesNames.orderNew }">
        <div class="home-button__icons">
          <icon-base icon-name="person" :width="48" :height="48" view-box="0 0 48 48">
            <icon-person />
          </icon-base>
          <icon-base icon-name="sync" :width="48" :height="48" view-box="0 0 48 48">
            <icon-sync />
          </icon-base>
          <icon-base icon-name="person" :width="48" :height="48" view-box="0 0 48 48">
            <icon-person />
          </icon-base>
        </div>
        <div class="home-button__text">Сделка между физическими&nbsp;лицами</div>
      </router-link>
      <router-link v-if="false" class="home-button home-button_last" :to="{ name: $routesNames.orderNew }">
        <div class="home-button__icons">
          <icon-base icon-name="building" :width="48" :height="48" view-box="0 0 48 48">
            <icon-building />
          </icon-base>
          <icon-base icon-name="sync" :width="48" :height="48" view-box="0 0 48 48">
            <icon-sync />
          </icon-base>
          <icon-base icon-name="building" :width="48" :height="48" view-box="0 0 48 48">
            <icon-building />
          </icon-base>
        </div>
        <div class="home-button__text">Сделка между юридическими&nbsp;лицами</div>
      </router-link>
    </main>
  </page-layout>
</template>

<script lang="ts" src="./home.ts"></script>
<style src="./home.css"></style>
