import {HomeType} from '../../types/home-type.enum.js';
import {GoodType} from '../../types/good-type.enum.js';
import { LocationType } from '../../types/location-type.js';
import UserDto from '../user/user.dto.js';


export default class UpdateOfferDto {
  public id!: string;

  public title?: string;

  public description?: string;

  public postDate?: Date;

  public image?: string[];

  public city?: string;

  public prevImg?: string;

  public isPremium?: boolean;

  public isFavorite?: boolean;

  public rating?: number;

  public type?: HomeType;

  public rooms?: number;

  public guests?: number;

  public price?: number;

  public goods?: GoodType[];

  public location?: LocationType;

  public user?: UserDto;

}
