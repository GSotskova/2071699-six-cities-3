import {Expose, Type} from 'class-transformer';
import OfferResponse from '../../offer/response/offer.response.js';
import UserResponse from '../../user/response/user.response.js';

export default class FavoriteResponse {
  @Expose()
  public id!: string;

  @Expose({ name: 'createdAt'})
  public postDate!: string;

  @Expose({ name: 'userId'})
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose({ name: 'offerId'})
  @Type(() => OfferResponse)
  public offer!: OfferResponse;
}
