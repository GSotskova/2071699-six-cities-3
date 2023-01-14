import CreateLocationDto from './dto/create-location.dto.js';
import {DocumentType} from '@typegoose/typegoose';
import {LocationEntity} from './location.entity.js';
import {LocationType} from '../../types/location-type.js';

export interface LocationServiceInterface {
  create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;
  findByLocationId(LocationId: string): Promise<DocumentType<LocationEntity> | null>;
  findByLocation(Location: LocationType): Promise<DocumentType<LocationEntity> | null>;
  findByLocationOrCreate(Location: LocationType, dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;
}
