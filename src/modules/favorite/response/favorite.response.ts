import {Expose, Transform, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';
import {CityType} from '../../../types/city-type.enum.js';
import {HomeType} from '../../../types/home-type.enum.js';
import {GoodType} from '../../../types/good-type.enum.js';
import LocationResponse from '../../location/response/location.response.js';


export default class FavorieResponse {
  @Expose({ name: '_id'})
  @Transform((value) => value.obj._id.toString())
  public id!: string;

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
  public image!: string[];

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

  @Expose({ name: 'locationId'})
  @Type(() => LocationResponse)
  public location!: LocationResponse;
}
