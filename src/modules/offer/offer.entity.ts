import typegoose, {defaultClasses, getModelForClass, Ref} from '@typegoose/typegoose';
import { CityType } from '../../types/city-type.enum.js';
import { HomeType } from '../../types/home-type.enum.js';
import { GoodType } from '../../types/good-type.enum.js';
import {UserEntity} from '../user/user.entity.js';
import {LocationEntity} from '../location/location.entity.js';
import { RATING_DEFAULT } from './offer.constant.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true})
  public description!: string;

  @prop()
  public postDate!: Date;

  @prop({
    city: () => String,
    enum: CityType
  })
  public city!: CityType;

  @prop({default: ''})
  public prevImg!: string;

  @prop({ type: String })
  public image!: string[];

  @prop()
  public isPremium!: boolean;

  @prop()
  public isFavorite!: boolean;

  @prop({
    required: false,
    default: RATING_DEFAULT,
  })
  public rating!: number;

  @prop({
    type: () => String,
    enum: HomeType
  })
  public type!: HomeType;

  @prop()
  public rooms!: number;

  @prop()
  public guests!: number;

  @prop()
  public price!: number;

  @prop({
    required: true,
    type: String,
    enum: GoodType
  })
  public goods!: GoodType[];


  @prop({default: 0})
  public commentCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({
    ref: LocationEntity,
    required: true
  })
  public locationId!: Ref<LocationEntity>;

}

export const OfferModel = getModelForClass(OfferEntity);
