import { readFileSync } from 'fs';
import { Offer } from '../../types/offer.type.js';
import { CityType } from '../../types/city-type.enum.js';
import { HomeType } from '../../types/home-type.enum.js';
import { UserType } from '../../types/user-type.enum.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([
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
        password,
        userType ,
        latitude,
        longitude
      ]) => ({
        title,
        description,
        postDate: new Date(createdDate),
        city: CityType[city as 'Paris' | 'Cologne' | 'Brussels' | 'Amsterdam' | 'Hamburg' | 'Dusseldorf'],
        prevImg,
        image: image.split(';').map((img) => (img)),
        isPremium: JSON.parse(isPremium),
        isFavorite: JSON.parse(isFavorite),
        rating: Number.parseFloat(rating),
        type: HomeType[type as 'apartment' | 'house' | 'room' | 'hotel'],
        rooms: Number.parseInt(rooms, 10),
        guests: Number.parseInt(guests,10),
        price: Number.parseInt(price, 10),
        goods: goods.split(';').map((good) => (good)),
        user: {name, email, avatarPath, password, userType: UserType[userType as 'standart' | 'pro']},
        location: {latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude)}
      }));
  }
}
