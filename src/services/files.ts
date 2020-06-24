import HTTP from '@/services/http-common';
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { FileUploadRequest, FileResponse } from '@/types/file';

export class V1FilesService {
  public static URLs: Readonly<Record<string, (...args: any[]) => string>> = {
    files: () => '/api/v1/files',
  };

  public static uploadFile({ files }: FileUploadRequest, config?: AxiosRequestConfig): AxiosPromise<FileResponse> {
    const formData = new FormData();
    formData.append('files', files);
    if (!config) {
      config = { headers: {} };
    }
    const defaultHeaders = { 'Content-Type': 'multipart/form-data' };
    config.headers = { ...defaultHeaders, ...config.headers };
    return HTTP.post(this.URLs.files(), formData, config);
  }

  // public static downloadFile({ files }: FileUploadRequest, config?: AxiosRequestConfig): AxiosPromise<FileResponse> {
  //     axios({
  //       url: '/api/v1/files/example.pdf',
  //       method: 'GET',
  //       responseType: 'blob', // important
  //     }).then((response) => {
  //       const url = window.URL.createObjectURL(new Blob([response.data]));
  //       const link = document.createElement('a');
  //       link.href = url;
  //       link.setAttribute('download', 'file.pdf');
  //       document.body.appendChild(link);
  //       link.click();
  //     });
  // }
}
