import { Component, Vue, Prop, Model, Watch } from 'vue-property-decorator';
import pdf from 'vue-pdf';

type Filetype = 'pdf' | 'image';

type FileUploadObject = {
  file: File;
  dataUrl: string;
  name: string;
  type: string;
  ext: string;
  size: string;
  error: string;
};

const validExt = ['jpg', 'jpeg', 'png', 'pdf'];

@Component({
  components: {
    pdf,
  },
})
export default class FileUploadInput extends Vue {
  @Model('change', { type: Array }) readonly value!: any[];
  @Prop({ default: false }) multiple!: boolean;

  files: FileUploadObject[] = [];
  fileNames: string[] = [];

  showModal = false;

  file = '';
  filetype: Filetype = 'image';

  pdfPageCount = 1;
  pdfPageCurrent = 1;

  convertFileToDataURL(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  toMbytes = (bytes: number): string => (bytes / Math.pow(1024, 2)).toFixed(2).replace('.', ',');

  async setFiles(event: Event) {
    const files: FileList = (event.target as HTMLInputElement).files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check for duplicate
      if (!this.fileNames.includes(file.name)) {
        this.files.push({
          file: file,
          dataUrl: await this.convertFileToDataURL(file),
          name: file.name,
          size: this.toMbytes(file.size),
          get ext() {
            return this.file.name.toLowerCase().split('.').pop();
          },
          get type() {
            return file.type.split('/')[0];
          },
          get error() {
            if (parseFloat(this.size) > 10) return 'size';
            if (!validExt.includes(this.ext)) return 'type';
            return '';
          },
        });
        this.fileNames.push(file.name);
      }
    }

    // for add accidently deleted same files on mobile
    (this.$refs.inputFile as HTMLInputElement).value = '';
  }

  deleteFile(fileName: string) {
    this.fileNames = this.fileNames.filter(el => el !== fileName);
    this.files = this.files.filter(el => el.name !== fileName);
  }

  @Watch('files')
  onFilesChange() {
    const filesToUpload = this.files.filter(file => !file.error);
    this.$emit('change', filesToUpload);
  }

  openFile(file: any) {
    if (!file.error) {
      this.filetype = file.type;
      this.pdfPageCurrent = 1;
      this.file = file.dataUrl;
      this.openModal();
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
