<template>
  <div class="form-group">
    <label>
      <slot>
        <div class="form-group-file-btn btn btn_link btn_file">
          <slot name="icon">
            <icon-base icon-name="paperclip" :width="24" :height="24" view-box="0 0 24 24">
              <icon-paperclip />
            </icon-base>
          </slot>
          <slot name="title">
            <span class="form-group-file-btn__text">
              Прикрепить файл
            </span>
          </slot>
        </div>
      </slot>
      <input
        style="display: none;"
        type="file"
        :accept="allowedFileMimeTypes.join(',')"
        :multiple="multiple"
        @change="setFiles"
      />
    </label>

    <slot v-for="el in orderDataFiles" name="file-item" :item="el" :itemStatus="getHumanReadableFileUploadStatus(el)">
      <div :key="el.key" slot-scope="{ item, itemStatus }" class="form-group-file__item">
        <button type="button" class="btn btn_link btn_no-border" @click="item.openFile">
          {{ item.file.name }}
        </button>
        ({{ itemStatus }})
        <button
          type="button"
          class="btn btn_danger btn_icon btn_no-border form-group-file__item__delete-btn"
          @click="el.cancelUpload"
        >
          {{ el.id ? 'Удалить' : 'Отменить' }}
        </button>
      </div>
    </slot>
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

<script lang="ts" src="./file-upload-input.ts"></script>
<style src="./file-upload-input.css"></style>
