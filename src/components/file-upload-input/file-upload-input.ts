import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator';
import IconBase from '@/components/icon-base/icon-base.vue';
import IconPaperclip from '@/components/icons/icon-paperclip.vue';
import { V1FilesService } from '@/services/files';
import axios, { AxiosResponse } from 'axios';
import { FileResponse } from '@/types/file';
import pdf from 'vue-pdf';

type Filetype = 'pdf' | 'image';

type FileUploadObject = {
  file: File;
  ext: string;
  filetype: Filetype;
  key: number;
  id?: string;
  errorStatus?: number;
  progress: number; // 0-100
  cancelUpload: Function;
  startUpload: Function;
  openFile: Function;
  state: 'initial' | 'uploading' | 'uploaded' | 'error';
};

@Component({
  components: {
    IconBase,
    IconPaperclip,
    pdf,
  },
})
export default class FileUploadInput extends Vue {
  @Model('change', { type: Array }) readonly value!: string[];
  @Prop({ required: false }) allowedFileMimeTypes?: string[];
  @Prop({ default: false }) multiple!: boolean;

  orderDataFiles: FileUploadObject[] = [];
  uploadingInProgress = false;

  showModal = false;

  file = '';
  filetype: Filetype = 'image';

  pdfPageCount = 1;
  pdfPageCurrent = 1;

  get orderDataFileIds(): string[] {
    return this.orderDataFiles.filter(({ id }) => Boolean(id)).map(({ id }) => id);
  }

  @Watch('orderDataFileIds')
  onChange() {
    this.$emit('change', this.orderDataFileIds);
  }

  setFiles(event: Event) {
    this.$emit('uploading-start');
    const files = (event.target as HTMLInputElement).files;
    Array.from(files).forEach(file => {
      const ext = file.name.split('.').pop();
      const filetype = ext === 'pdf' ? 'pdf' : 'image';
      const orderDataFileElement: FileUploadObject = {
        file,
        ext,
        filetype,
        id: null, // must be for reactive
        key: Math.random(),
        progress: 0, // must be for reactive
        errorStatus: null,
        state: 'initial',
        cancelUpload: null,
        startUpload: () => {
          orderDataFileElement.state = 'uploading';
          return V1FilesService.uploadFile(
            { files: file },
            {
              onUploadProgress(progressEvent) {
                orderDataFileElement.progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              },
              cancelToken: new axios.CancelToken((cancel: Function) => {
                orderDataFileElement.cancelUpload = () => {
                  if (orderDataFileElement.progress < 100) {
                    cancel(`Cancel uploading for file: ${file.name}`);
                  }
                  this.orderDataFiles = this.orderDataFiles.filter(el => el !== orderDataFileElement);
                };
              }),
            }
          )
            .then((resp: AxiosResponse<FileResponse>) => {
              orderDataFileElement.id = resp.data[0].file_id;
              orderDataFileElement.state = 'uploaded';
              return resp;
            })
            .catch(err => {
              const status = err?.response?.status;
              orderDataFileElement.errorStatus = status || 500;
              orderDataFileElement.state = 'error';
            })
            .finally(() => {
              this.onSingleFileUploadingEnd();
            });
        },
        openFile: () => {
          const reader = new FileReader();

          reader.onload = (e: any) => {
            this.filetype = orderDataFileElement.filetype;
            this.pdfPageCurrent = 1;
            this.file = e.target.result;
            this.openModal();
          };

          reader.readAsDataURL(orderDataFileElement.file);
        },
      };

      if (this.allowedFileMimeTypes && !this.allowedFileMimeTypes.includes(file.type)) {
        // skip file if mimetype is not allowed
        orderDataFileElement.state = 'error';
        orderDataFileElement.errorStatus = 1;
        orderDataFileElement.startUpload = null;
        orderDataFileElement.cancelUpload = () => {
          this.orderDataFiles = this.orderDataFiles.filter(el => el !== orderDataFileElement);
        };
        this.onSingleFileUploadingEnd();
      }

      this.orderDataFiles.push(orderDataFileElement);

      orderDataFileElement.startUpload();
    });
    (event.target as HTMLInputElement).value = '';
  }

  getHumanReadableFileUploadStatus(el: FileUploadObject) {
    if (el.errorStatus === 1) {
      return 'Ошибка: Выбран недопустимый формат файла. Выберите файл в формате png, jpg, jpeg, pdf';
    } else if (el.errorStatus === 413) {
      return 'Ошибка: Файл слишком большой. Максимальный размер файла 10 мб';
    } else if (el.errorStatus) {
      return 'Внутренняя ошибка сервера';
    }
    if (el.id) {
      return 'Успешно загружен';
    } else if (el.progress === 100) {
      return 'Загружается: 99%';
    } else {
      return `Загружается: ${el.progress}%`;
    }
  }

  onSingleFileUploadingEnd() {
    if (this.orderDataFiles.every(f => ['uploaded', 'error'].includes(f.state))) {
      this.$emit('uploading-end');
    }
  }

  openModal() {
    document.body.style.overflow = 'hidden';
    this.showModal = true;
  }

  closeModal() {
    document.body.style.overflow = 'initial';
    this.showModal = false;
  }

  pdfPagePrev() {
    this.pdfPageCurrent = this.pdfPageCurrent === 1 ? 1 : this.pdfPageCurrent - 1;
  }

  pdfPageNext() {
    this.pdfPageCurrent = this.pdfPageCurrent < this.pdfPageCount ? this.pdfPageCurrent + 1 : this.pdfPageCount;
  }
}
