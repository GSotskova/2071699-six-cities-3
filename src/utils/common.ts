import crypto from 'crypto';
import * as jose from 'jose';
import {plainToInstance, ClassConstructor} from 'class-transformer';
import {ValidationError} from 'class-validator';
import { Offer } from '../types/offer.type.js';
import { CityType } from '../types/city-type.enum.js';
import { HomeType } from '../types/home-type.enum.js';
import { UserType } from '../types/user-type.enum.js';
import { GoodType } from '../types/good-type.enum.js';
import {ValidationErrorField} from '../types/validation-error-field.type.js';
import {ServiceError} from '../types/service-error.enum.js';
import {UnknownObject} from '../types/unknown-object.type.js';
import {DEFAULT_STATIC_IMAGES} from '../app/application.constant.js';

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

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};


export const transformObjectString = (property: string, staticPath: string, uploadPath: string, target: UnknownObject) => {
  const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
  target[property] = `${rootPath}/${target[property]}`;
};

export const transformObjectArray = (property: string, staticPath: string, uploadPath: string, target: UnknownObject) => {
  const targetArr = target[property] as string[];
  const resultArr: string[] = [];
  targetArr.forEach((el) => {
    const rootPath = DEFAULT_STATIC_IMAGES.includes(el) ? staticPath : uploadPath;
    el = `${rootPath}/${el}`;
    resultArr.push(el);
  });
  target[property] = resultArr;
};


export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      if (target[property] instanceof Array) {
        transformObjectArray(property, staticPath, uploadPath, target);
      } else {
        transformObjectString(property, staticPath, uploadPath, target);
      }
    }));
};
