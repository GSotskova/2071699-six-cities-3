import { HomeType } from '../../../types/home-type.enum.js';
import {IsOptional, IsArray, IsDateString, IsEnum, IsInt, Max, MaxLength, Min, MinLength, ArrayMaxSize, ArrayMinSize, IsBoolean} from 'class-validator';
import {CITIES_LIST} from '../offer.constant.js';
import { CityType } from '../../../types/city-type.enum.js';

export default class UpdateOfferDto {
  @IsOptional()
  @IsInt({message: 'Price must be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public price?: number;

  @IsOptional()
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @IsOptional()
  @IsEnum(HomeType, {message: 'type must be one of apartment, house, room, hotel'})
  public type?: HomeType;

  @IsOptional()
  @IsBoolean( {message: 'isFavorite must be true or false'})
  public isFavorite?: boolean;

  @IsOptional()
  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate?: Date;

  @IsOptional()
  @IsArray({message: 'Field image must be an array'})
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  public image?: string[];

  @IsOptional()
  @IsEnum(CityType, {message: `city must be one of ${CITIES_LIST}`})
  public city?: string;

  @IsOptional()
  @MaxLength(256, {message: 'Too short for field «image»'})
  public prevImg?: string;

  @IsOptional()
  @IsBoolean( {message: 'isPremium must be true or false'})
  public isPremium?: boolean;

  @IsOptional()
  @IsInt({message: 'Rating must be an integer'})
  public rating?: number;
}
