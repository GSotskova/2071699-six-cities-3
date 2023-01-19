import { HomeType } from '../../../types/home-type.enum.js';

export default class UpdateOfferDto {
  public price?: number;
  public title?: string;
  public type?: HomeType;
  public isFavorite?: boolean;
  public postDate?: Date;
  public image?: string;
  public city?: string;
  public prevImg?: string[];
  public isPremium?: boolean;
  public rating?: number;
}
