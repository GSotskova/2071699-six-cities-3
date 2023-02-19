import UpdateOfferDto from '../../dto/offer/update-offer.dto';
import {CommentAuth, EditOffer, NewOffer, UserRegister} from '../../types/types';
import CreateOfferDto from '../../dto/offer/create-offer.dto';
import CreateCommentDto from '../../dto/comment/create-comment.dto';
import {HomeType} from '../../types/home-type.enum';
import { GoodType } from '../../types/good-type.enum';
import { UserTypeServer } from '../../types/user-type.enum';
import { UserType } from '../../const';
import CreateUserDto from '../../dto/user/create-user.dto';
import {getTime} from '../utils';

export const adaptUserToServer =
  (user: UserRegister): CreateUserDto => ({
    name: user.name,
    email: user.email,
    userType: user.type === UserType.Regular ? UserTypeServer.Standart : UserTypeServer.Pro,
    password: user.password
  });

export const adaptEditOfferToServer =
  (offer: EditOffer): UpdateOfferDto => ({
    id: offer.id.toString(),
    price: offer.price,
    rating:  offer.rating,
    title:  offer.title,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    city: offer.city.name,
    location: offer.location,
    type: offer.type as HomeType,
    rooms: offer.bedrooms,
    description: offer.description,
    goods:  offer.goods?.map((good) => good as GoodType),
    guests: offer.maxAdults
  });

export const adaptCreateOfferToServer =
  (offer: NewOffer): CreateOfferDto => ({
    price: offer.price,
    title: offer.title,
    postDate: getTime(),
    isPremium: offer.isPremium,
    city: offer.city.name,
    type: offer.type as HomeType,
    rooms: offer.bedrooms,
    description: offer.description,
    goods: offer.goods.map((good) => good as GoodType),
    guests: offer.maxAdults,
    isFavorite: false,
    rating: 1
  });

export const adaptCreateCommentToServer =
  (comment: CommentAuth): CreateCommentDto => ({
    text: comment.comment,
    rating: comment.rating,
    offerId: comment.id
  });

export const adaptAvatarToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('avatar', file);

    return formData;
  };

export const adaptPrevImageToServer =
  (file: string) => {
    const formData = new FormData();
    formData.set('prevImg', file);
    return formData;
  };

export const adaptImagesToServer =
  (files: string[]) => {
    const formData = new FormData();

    for(let i = 0; i < files.length; i++){
      formData.append('image',files[i]);
    }
    return formData;
  };

