import {Expose} from 'class-transformer';

export default class LocationResponse {
  @Expose()
  public id!: string;

  @Expose()
  public latitude!: number ;

  @Expose()
  public longitude!: number;

}
