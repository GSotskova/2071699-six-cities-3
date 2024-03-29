import {DocumentType} from '@typegoose/typegoose';
import {OfferEntity} from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import { DocumentExistsInterface } from '../../types/document-exists.interface.js';

export interface OfferServiceInterface extends DocumentExistsInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findByTitle(title: string): Promise<DocumentType<OfferEntity> | null>;
  find(userAuthorization?: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorite(): Promise<DocumentType<OfferEntity>[]>;
  editStatusFavorite(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateRating(offerId: string): Promise<number | null >;

  exists(documentId: string): Promise<boolean>;
}
