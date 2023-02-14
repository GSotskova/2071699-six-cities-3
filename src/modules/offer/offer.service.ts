import {inject, injectable} from 'inversify';
import {OfferServiceInterface} from './offer-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {DocumentType, /*mongoose,*/ types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {DEFAULT_OFFER_COUNT, OFFER_PREMIUM_COUNT} from './offer.constant.js';
import {SortType} from '../../types/sort-type.enum.js';
import { LocationServiceInterface } from '../location/location-service.interface.js';
import LocationService from '../../modules/location/location.service.js';
import {LocationModel} from '../../modules/location/location.entity.js';
import { FavoriteModel } from '../favorite/favorite.entity.js';
import { FavoriteServiceInterface } from '../favorite/favorite-service.interface.js';
import FavoriteService from '../favorite/favorite.service.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  private locationService!: LocationServiceInterface;
  private favoriteService!: FavoriteServiceInterface;
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {
    this.locationService = new LocationService(this.logger, LocationModel);
    this.favoriteService = new FavoriteService(this.logger, FavoriteModel);
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const location = await this.locationService.findIdByCity(dto.city);
    const result = await this.offerModel.create({...dto, locationId: location});

    this.logger.info(`New offer created: ${dto.title}`);

    return result;

  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['userId', 'locationId'])
      .exec();
  }

  public async findByTitle(title: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findOne({title}).exec();
  }

  public async updateFavorite(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId,{
        '$set': {isFavorite: true,}
      }).exec();
  }

  public async updateFavorites(userAuthorization: string): Promise<DocumentType<OfferEntity>[]> {

    await this.offerModel.updateMany({ $set: {isFavorite: false}}).exec();

    const favoritesUserCurrent = await this.favoriteService.findByUserId(userAuthorization);
    if (!favoritesUserCurrent) {
      return [];
    }

    favoritesUserCurrent.forEach((favorite) => favorite.offerId ? this.updateFavorite( favorite.offerId.toString()) : null);

    return await this.offerModel.find().populate(['userId', 'locationId']).exec();
  }


  public async find(userAuthorization?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    if (!userAuthorization) {
      await this.offerModel.updateMany({ $set: {isFavorite: false}}).exec();
    }
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.offerModel
      .find({}, {}, {limit})
      .sort({postDate: SortType.Down})
      .populate(['userId', 'locationId'])
      .exec();
  }

  public async updateRating(offerId: string): Promise<number | null > {
    const currentOffer = await this.offerModel.findById(offerId);
    const offerWithNewRating = await this.offerModel
      .aggregate([
        { $match: { title: currentOffer?.title } },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            pipeline: [
              { $project: { rating: 1}},
              { $group: { _id: null, ratingAvg: { $avg: '$rating' } } }
            ],
            as: 'result'
          },
        },
        {$unwind: '$result',},
        { $addFields: { rating: '$result.ratingAvg' }},
        { $unset: 'result' },
      ]);
    return offerWithNewRating[0] ? offerWithNewRating[0].rating : 0;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const newRating = await this.updateRating(offerId);
    return this.offerModel
      .findByIdAndUpdate(offerId, {...dto, rating: newRating}, {new: true})
      .populate(['userId', 'locationId'])
      .exec();
  }


  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const newRating = await this.updateRating(offerId);
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$set': {rating: newRating},
        '$inc': {commentCount: 1}
      }).exec();
  }

  public async findPremium(cityName: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({isPremium: true, city: cityName}, {}, {OFFER_PREMIUM_COUNT})
      .sort({postDate: SortType.Down})
      .populate(['userId', 'locationId'])
      .exec();
  }

  public async findFavorite(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({isFavorite: true})
      .populate(['userId', 'locationId'])
      .exec();
  }

  public async editStatusFavorite(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const currentOffer = await this.offerModel.findById(offerId);
    return this.offerModel
      .findByIdAndUpdate(offerId,{
        '$set': {isFavorite: !currentOffer?.isFavorite,}
      }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }


}
