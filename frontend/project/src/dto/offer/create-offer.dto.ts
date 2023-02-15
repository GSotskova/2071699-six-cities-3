import {HomeType} from '../../types/home-type.enum.js';
import {GoodType} from '../../types/good-type.enum.js';
import { LocationType } from '../../types/location-type.js';


export default class CreateOfferDto {

  public title!: string;

  public description!: string;

  public postDate!: string;

  public city!: string;

  public isPremium!: boolean;

  public type!: HomeType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public goods!: GoodType[];

  public prevImg?: string;

  public image?: string[];

  public isFavorite!: boolean;

  public rating!: number;

  public location?: LocationType;
}

