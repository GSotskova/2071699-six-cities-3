import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { HomeType } from '../../types/home-type.enum.js';
import { GoodType } from '../../types/good-type.enum.js';
import { UserTypeServer } from '../../types/user-type.enum.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

const PriceRange = {
  MinPrice: 100,
  MaxPrice: 100000
} as const;

const RatingRange = {
  MinRating: 1,
  MaxRating: 5
} as const;

const RoomsRange = {
  MinRooms: 1,
  MaxRooms: 8
} as const;

const GuestsRange = {
  MinGuests: 1,
  MaxGuests: 10
} as const;

const WeekDayRange = {
  FirstWeekDay: 1,
  LastWeekDay: 7
} as const;


export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs().subtract(generateRandomValue(WeekDayRange.FirstWeekDay, WeekDayRange.LastWeekDay), 'day').toISOString();
    const prevImg = getRandomItem<string>(this.mockData.prevImages);
    const image = getRandomItems<string>(this.mockData.images, 6).join(';');
    const isPremium = getRandomItem<string>(['true','false']);
    const isFavorite = getRandomItem<string>(['true','false']);
    const rating = generateRandomValue(RatingRange.MinRating, RatingRange.MaxRating, 1).toString();
    const type = getRandomItem(Object.keys(HomeType));
    const rooms = generateRandomValue(RoomsRange.MinRooms, RoomsRange.MaxRooms).toString();
    const guests = generateRandomValue(GuestsRange.MinGuests, GuestsRange.MaxGuests).toString();
    const price = generateRandomValue(PriceRange.MinPrice, PriceRange.MaxPrice).toString();
    const goods = getRandomItems<string>(Object.values(GoodType)).join(';');
    const name = getRandomItem<string>(this.mockData.users);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const userType = getRandomItem(Object.keys(UserTypeServer));
    const location = getRandomItem<string>(this.mockData.locations);

    const [city, latitude, longitude] = location.split(' ');

    return [
      title, description, createdDate, city,
      prevImg, image, isPremium,
      isFavorite, rating, type, rooms,
      guests, price, goods, name, email,
      avatar, userType, latitude, longitude
    ].join('\t');
  }
}
