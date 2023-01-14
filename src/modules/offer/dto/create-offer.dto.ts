import {CityType} from '../../../types//city-type.enum.js';
import {HomeType} from '../../../types/home-type.enum.js';
import {GoodType} from '../../../types/good-type.enum.js';

export default class CreateOfferDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public city!: CityType;
  public prevImg!: string;
  public image!: string[];
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: HomeType;
  public rooms!: number;
  public guests!: number;
  public price!: number;
  public goods!: GoodType[];
  public userId!: string;
  public locationId!: string;
}

