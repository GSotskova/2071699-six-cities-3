import {inject, injectable} from 'inversify';
import {OfferServiceInterface} from './offer-service.interface.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {DEFAULT_OFFER_COUNT, OFFER_PREMIUM_COUNT} from './offer.constant.js';
import {SortType} from '../../types/sort-type.enum.js';
import { LocationServiceInterface } from '../location/location-service.interface.js';
import LocationService from '../../modules/location/location.service.js';
import {LocationModel} from '../../modules/location/location.entity.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import { UserModel } from '../user/user.entity.js';
import UserService from '../user/user.service.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  private locationService!: LocationServiceInterface;
  private userService!: UserServiceInterface;
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {
    this.locationService = new LocationService(this.logger, LocationModel);
    this.userService = new UserService(this.logger, UserModel);
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const userID = dto.userId === ' ' ?
      await this.userService.findIdByEmail(dto.userEmail)
      : dto.userId;

    const location = await this.locationService.findIdByCity(dto.city);

    const result = await this.offerModel.create({...dto, userId: userID, locationId: location});

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

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
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
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
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
      .findByIdAndUpdate(offerId,{ $set: {
        isFavorite: !currentOffer?.isFavorite,
      }}).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }
}
