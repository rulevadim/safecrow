<template>
  <page-layout>
    <main class="page-main">
      <div class="page-main__title">Пожалуйста, авторизуйтесь</div>

      <login-form :is-need-redirect-after-login="true" :redirect-path="redirectPath" @login-success="onLoginSuccess" />
    </main>
  </page-layout>
</template>

<script lang="ts" src="./auth-login.ts"></script>
<style src="./auth-login.css"></style>
