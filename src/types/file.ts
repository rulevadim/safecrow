export type FileUploadRequest = {
  files: File;
};

export type FileObjectInResponse = {
  file_id: string;
  name: string;
};

export type FileResponse = FileObjectInResponse[];
