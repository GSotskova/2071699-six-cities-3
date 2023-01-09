import { Offer } from '../types/offer.type.js';
import { CityType } from '../types/city-type.enum.js';
import { HomeType } from '../types/home-type.enum.js';
import { UserType } from '../types/user-type.enum.js';
import { GoodType } from '../types/good-type.enum.js';

export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [
    title,
    description,
    createdDate,
    city,
    prevImg,
    image,
    isPremium,
    isFavorite,
    rating,
    type,
    rooms,
    guests,
    price,
    goods,
    name,
    email,
    avatarPath,
    userType ,
    latitude,
    longitude
  ] = tokens;
  return {
    title,
    description,
    postDate: new Date(createdDate),
    city: CityType[city as 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'],
    prevImg,
    image: image.split(';').map((img) => (img)),
    isPremium: JSON.parse(isPremium),
    isFavorite: JSON.parse(isFavorite),
    rating: Number.parseFloat(rating),
    type: HomeType[type as 'Apartment' | 'House' | 'Room' | 'Hotel'],
    rooms: Number.parseInt(rooms, 10),
    guests: Number.parseInt(guests,10),
    price: Number.parseInt(price, 10),
    goods: goods.split(';').map((good) => good as GoodType),
    user: {name, email, avatarPath, userType: UserType[userType as 'Standart' | 'Pro']},
    location: {latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude)}
  } as Offer;
};
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';
