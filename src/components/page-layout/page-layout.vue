<template>
  <div id="app">
    <slot v-if="!hideHeader" name="header">
      <PageHeader></PageHeader>
    </slot>
    <div class="main-wrapper">
      <slot v-if="isLoading" name="loader">
        <main class="page-main page-main_loading">
          <icon-base icon-name="spinner" :width="80" :height="80" view-box="0 0 100 100">
            <icon-spinner />
          </icon-base>
        </main>
      </slot>
      <slot v-else-if="pageError" name="error">
        <main class="page-main page-main_error">
          <component :is="errorComponent" v-bind="errorComponentProps" />
        </main>
      </slot>
      <slot v-else />
    </div>
    <slot v-if="!hideFooter" name="footer">
      <PageFooter></PageFooter>
    </slot>
  </div>
</template>

<script src="./page-layout.ts" lang="ts"></script>
<style src="./page-layout.css"></style>
