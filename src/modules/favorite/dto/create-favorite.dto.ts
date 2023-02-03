import {IsMongoId} from 'class-validator';

export default class CreateFavoriteDto {
  public userId!: string;

  @IsMongoId({message: 'offerId field must be a valid id'})
  public offerId!: string;
}
