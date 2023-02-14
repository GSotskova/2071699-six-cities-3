import dayjs from 'dayjs';
import { MockData } from '../../types/mock-data.type.js';
import { HomeType } from '../../types/home-type.enum.js';
import { GoodType } from '../../types/good-type.enum.js';
import { UserTypeServer } from '../../types/user-type.enum.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/random.js';
import { OfferGeneratorInterface } from './offer-generator.interface.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROMMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const prevImg = getRandomItem<string>(this.mockData.prevImages);
    const image = getRandomItems<string>(this.mockData.images, 6).join(';');
    const isPremium = getRandomItem<string>(['true','false']);
    const isFavorite = getRandomItem<string>(['true','false']);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1).toString();
    const type = getRandomItem(Object.keys(HomeType));
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROMMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
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
