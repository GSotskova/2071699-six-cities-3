import { CityType } from './city-type.enum.js';
import { HomeType } from './home-type.enum.js';
import { LocationType } from './location-type.js';
import { User } from './user.type.js';
import { GoodType } from './good-type.enum.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: CityType;
  prevImg: string;
  image: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HomeType;
  rooms: number;
  guests: number;
  price: number;
  goods: GoodType[];
  user: User;
  location: LocationType;
}
