import CreateFavoriteDto from './dto/create-favorite.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {FavoriteEntity} from './favorite.entity.js';

export interface FavoriteServiceInterface {
  create(dto: CreateFavoriteDto): Promise<DocumentType<FavoriteEntity>>;
  find(UserId: string, OfferId: string): Promise<DocumentType<FavoriteEntity> | null>;
  findByOfferId(OfferId: string): Promise<DocumentType<FavoriteEntity> | null>;
  findByUserId(UserId: string): Promise<DocumentType<FavoriteEntity> | null>;
  deleteById(UserId: string, OfferId: string): Promise<DocumentType<FavoriteEntity> | null>;
}
