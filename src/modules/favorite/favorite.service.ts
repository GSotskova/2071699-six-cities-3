import {inject, injectable} from 'inversify';
import {DocumentType, ModelType} from '@typegoose/typegoose/lib/types.js';
import {FavoriteServiceInterface} from './favorite-service.interface.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {FavoriteEntity} from './favorite.entity.js';
import CreateFavoriteDto from './dto/create-favorite.dto.js';


@injectable()
export default class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.FavoriteModel) private readonly favoriteModel: ModelType<FavoriteEntity>
  ) {}

  public async create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>> {
    const result = await this.favoriteModel.create(dto);
    this.logger.info('New favorite created');
    return result.populate(['userId', 'offerId']);
  }

  public async findByUserId(userId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findById(userId).exec();
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findById(offerId).exec();
  }

  public async find(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findOne({userId: userId, offerId: offerId}).exec();
  }

  public async deleteById(userId: string, offerId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findOneAndDelete({userId: userId, offerId: offerId}).exec();
  }


}
