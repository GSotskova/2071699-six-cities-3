import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';
import {CityType} from '../../../types/city-type.enum.js';
import {HomeType} from '../../../types/home-type.enum.js';
import {GoodType} from '../../../types/good-type.enum.js';
import {LocationType} from '../../../types/location-type.js';


export default class OfferResponse {
  @Expose()
  public title!: string ;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: string;

  @Expose()
  public city!: CityType;

  @Expose()
  public prevImg!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: HomeType;

  @Expose()
  public apartment!: string;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: GoodType[];

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public comments!: number;

  @Expose()
  public location!: LocationType;
}
