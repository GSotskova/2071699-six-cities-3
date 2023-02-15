import { UserType } from '../../const';
import CommentDto from '../../dto/comment/comment.dto';
import OfferDto from '../../dto/offer/offer.dto';
import UpdateOfferDto from '../../dto/offer/update-offer.dto';
import UserWithTokenDto from '../../dto/user/user-with-token.dto';
import UserDto from '../../dto/user/user.dto';
import { CityType } from '../../types/city-type.enum';
import {User, Offers, Comments, Comment, Offer, EditOffer} from '../../types/types';
import { UserTypeServer } from '../../types/user-type.enum';


export const adaptLoginToClient =
  (user: UserWithTokenDto): User => ({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarPath,
    type: user.userType === UserTypeServer.Standart ? UserType.Regular : UserType.Pro,
    token: user.token,
  });

export const adaptUserToClient =
  (user: UserDto): User => ({
    name: user.name,
    email: user.email,
    type: user.userType === UserTypeServer.Standart ? UserType.Regular : UserType.Pro,
    avatarUrl: user.avatarPath,
  });

export const adaptOffersToClient =
  (offers: OfferDto[]): Offers =>
    offers
      .map((offer: OfferDto) => ({
        id: offer.id.toString(),
        price: offer.price,
        rating: offer.rating,
        title: offer.title,
        isPremium: offer.isPremium,
        isFavorite: offer.isFavorite,
        city: {name: offer.city, location: offer.location},
        location: offer.location,
        previewImage: offer.prevImg,
        type: offer.type,
        bedrooms: offer.rooms,
        description: offer.description,
        goods: offer.goods?.map((good)=>good.toString()),
        host:adaptUserToClient(offer.user),
        images: offer.image,
        maxAdults: offer.guests
      }));

export const adaptOfferToClient =
  (offer: OfferDto): Offer =>
    ({
      id: offer.id.toString(),
      price: offer.price,
      rating: offer.rating,
      title: offer.title,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      city:{name: offer.city, location: offer.location},
      location: offer.location,
      previewImage: offer.prevImg,
      type: offer.type,
      bedrooms: offer.rooms,
      description: offer.description,
      goods: offer.goods?.map((good)=>good.toString()),
      host:adaptUserToClient(offer.user),
      images: offer.image,
      maxAdults: offer.guests
    });


export const adaptCommentsToClient =
  (comments: CommentDto[]): Comments =>
    comments
      .filter((comment: CommentDto) =>
        comment.user !== null,
      )
      .map((comment: CommentDto) => ({
        id: comment.id,
        comment: comment.text,
        date: comment.postDate,
        rating: comment.rating,
        user: adaptUserToClient(comment.user),
      }));

export const adaptCommentToClient =
  (comment: CommentDto): Comment =>
    ({
      id: comment.id,
      comment: comment.text,
      date: comment.postDate,
      rating: comment.rating,
      user: adaptUserToClient(comment.user),
    });
