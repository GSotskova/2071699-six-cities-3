import {Expose} from 'class-transformer';

export default class UploadImagesResponse {
  @Expose()
  public image!: string[];
}

