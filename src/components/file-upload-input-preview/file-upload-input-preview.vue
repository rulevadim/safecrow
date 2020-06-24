<template>
  <div>
    <label>
      <!-- If <button> click on input not work -->
      <div class="form-group-file-btn btn btn_link btn_file">
        <font-awesome-icon icon="paperclip" class="file-btn-icon" />
        <span class="order-new-form__contract-file-btn__text">
          Прикрепить файл договора
        </span>
      </div>
      <input
        ref="inputFile"
        style="display: none;"
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        multiple
        @change="setFiles"
      />
    </label>
    <div
      v-for="file in files"
      :key="file.name"
      class="file-preview"
      :class="{ 'file-preview_error': file.error }"
      @click="openFile(file)"
    >
      <img v-if="file.type === 'image'" class="file-preview__img" :src="file.dataUrl" :alt="file.name" />
      <div v-else class="file-preview__icon">
        <font-awesome-icon icon="file-pdf" style="width: 100%; height: 100%;" />
      </div>

      <div class="file-preview__description">
        <template v-if="file.error">
          <div v-if="file.error === 'size'" class="file-preview__error">
            <!-- Максимальный размер файла &mdash; 10 МБайт -->
            Ошибка: Файл слишком большой. Максимальный размер файла 10&nbsp;МБайт
          </div>
          <div v-else-if="file.error === 'type'" class="file-preview__error">
            <!-- Максимальный размер файла &mdash; 10 МБайт -->
            Ошибка: Выбран недопустимый формат файла. Выберите файл в&nbsp;формате png, jpg, jpeg, pdf
          </div>
        </template>
        <div class="file-preview__name">{{ file.name }}</div>
        <div class="file-preview__size">{{ file.size }} MБайт</div>
      </div>
      <button type="button" class="file-preview__btn btn btn_link" @click.stop="deleteFile(file.name)">
        <font-awesome-icon icon="trash" />
      </button>
    </div>

    <div v-if="showModal" class="modal">
      <button type="button" class="form-group-file__btn-close-modal" @click="closeModal">
        <font-awesome-icon icon="times" style="width: 100%; height: 100%;" />
      </button>
      <template v-if="filetype === 'image'">
        <div class="form-group-file__img-wrapper">
          <img :src="file" alt="image" class="form-group-file__img" />
        </div>
      </template>
      <template v-else>
        <div class="form-group-file__pdf-page-wrapper">
          <pdf
            ref="pdf"
            :src="file"
            :page="pdfPageCurrent"
            class="form-group-file__pdf-page"
            @num-pages="pdfPageCount = $event"
          ></pdf>
        </div>
        <div class="form-group-file__pdf-btns">
          <button type="button" @click="pdfPagePrev">
            <font-awesome-icon icon="arrow-circle-left" style="font-size: 2rem;" />
          </button>
          <span>{{ pdfPageCurrent }} из {{ pdfPageCount }}</span>
          <button type="button" @click="pdfPageNext">
            <font-awesome-icon icon="arrow-circle-right" style="font-size: 2rem;" />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" src="./file-upload-input-preview.ts"></script>
<style src="./file-upload-input-preview.css"></style>
