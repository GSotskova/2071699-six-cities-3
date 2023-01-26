import {inject, injectable} from 'inversify';
import {DocumentType, ModelType} from '@typegoose/typegoose/lib/types.js';
import {LocationServiceInterface} from './location-service.interface.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {LocationEntity} from './location.entity.js';
import CreateLocationDto from './dto/create-location.dto.js';
import {LocationType} from '../../types/location-type.js';

@injectable()
export default class LocationService implements LocationServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.LocationModel) private readonly locationModel: ModelType<LocationEntity>
  ) {}

  public async create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    const result = await this.locationModel.create(dto);
    this.logger.info(`New location created: ${dto.latitude}  ${dto.longitude}`);
    return result;
  }

  public async findByLocationId(locationId: string): Promise<DocumentType<LocationEntity> | null> {
    return this.locationModel.findById(locationId).exec();
  }

  public async findByLocation(Location: LocationType): Promise<DocumentType<LocationEntity> | null> {
    return this.locationModel.findOne(Location).exec();
  }

  public async findByLocationCity(City: string, dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    const existedLocation = await this.locationModel.findOne({city: City});

    if (existedLocation) {
      return existedLocation;
    }

    return this.create(dto);
  }

  public async findIdByCity(City: string): Promise<string | null > {
    const existedLocation = await this.locationModel.findOne({city: City});

    if (existedLocation) {
      return existedLocation._id.toString();
    }

    return '';
  }


  public async findByLocationOrCreate(Location: LocationType, dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    const existedLocation = await this.findByLocation(Location);

    if (existedLocation) {
      return existedLocation;
    }

    return this.create(dto);
  }
}
