import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {LocationEntity, LocationModel} from './location.entity.js';
import {LocationServiceInterface} from './location-service.interface.js';
import LocationService from './location.service.js';
import {Component} from '../../types/component.types.js';

const locationContainer = new Container();

locationContainer.bind<LocationServiceInterface>(Component.LocationServiceInterface).to(LocationService);
locationContainer.bind<types.ModelType<LocationEntity>>(Component.LocationModel).toConstantValue(LocationModel);

export {locationContainer};
