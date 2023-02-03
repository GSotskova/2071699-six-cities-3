import {CityType} from '../../../types//city-type.enum.js';
import {HomeType} from '../../../types/home-type.enum.js';
import {GoodType} from '../../../types/good-type.enum.js';
import {IsArray, IsDateString, IsEnum, IsInt, IsMongoId, Max, MaxLength, Min, MinLength, ArrayMaxSize, ArrayMinSize, IsBoolean} from 'class-validator';
import {CITIES_LIST} from '../offer.constant.js';

export default class CreateOfferDto {
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate!: Date;

  @IsEnum(CityType, {message: `city must be one of ${CITIES_LIST}`})
  public city!: CityType;

  @MaxLength(256, {message: 'Too short for field «image»'})
  public prevImg!: string;

  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsArray({message: 'Field image must be an array'})
  public image!: string[];

  @IsBoolean( {message: 'isPremium must be true or false'})
  public isPremium!: boolean;

  @IsBoolean( {message: 'isFavorite must be true or false'})
  public isFavorite!: boolean;

  @IsInt({message: 'Rating must be an integer'})
  @Min(1, {message: 'Minimum rating is 1'})
  @Max(5, {message: 'Maximum rating is 5'})
  public rating!: number;

  @IsEnum(HomeType, {message: 'type must be one of apartment, house, room, hotel'})
  public type!: HomeType;

  @IsInt({message: 'Rooms must be an integer'})
  @Min(1, {message: 'Minimum rooms is 1'})
  @Max(8, {message: 'Maximum rooms is 8'})
  public rooms!: number;

  @IsInt({message: 'Guests must be an integer'})
  @Min(1, {message: 'Minimum guests is 1'})
  @Max(10, {message: 'Maximum guests is 10'})
  public guests!: number;

  @IsInt({message: 'Price must be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public price!: number;

  @IsArray({message: 'Goods categories must be an array'})
  @ArrayMinSize(1)
  @IsEnum(GoodType, {each: true, message: 'goods must be an array'})
  public goods!: GoodType[];

  public userId!: string;

  @IsMongoId({message: 'locationId field must be valid an id'})
  public locationId!: string;
}

