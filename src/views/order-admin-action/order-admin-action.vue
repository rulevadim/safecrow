<template>
  <page-layout>
    <main class="page-main page-main_order-show">
      <div class="page-main__title page-main__title_order-show">
        Изменение статуса
      </div>

      <template v-if="adminActionNameToDataMap">
        <button
          class="btn btn_primary"
          style="padding: 10px 30px;"
          :disabled="adminActionSuccessText || adminActionInProgress"
          @click="adminActionNameToDataMap.action"
        >
          {{ adminActionNameToDataMap.title }}
        </button>
        <div v-if="adminActionErrorText">
          {{ adminActionErrorText }}
        </div>
        <div v-if="adminActionSuccessText">
          {{ adminActionSuccessText }}
        </div>
      </template>
      <div v-else>
        Неверный тип действия.
      </div>
    </main>
  </page-layout>
</template>

<script lang="ts" src="./order-admin-action.ts"></script>
<style src="./order-admin-action.css"></style>
