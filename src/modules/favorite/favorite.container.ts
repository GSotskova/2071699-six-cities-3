import {Container} from 'inversify';
import {types} from '@typegoose/typegoose';
import {FavoriteEntity, FavoriteModel} from './favorite.entity.js';
import {FavoriteServiceInterface} from './favorite-service.interface.js';
import FavoriteService from './favorite.service.js';
import {Component} from '../../types/component.types.js';

const favoriteContainer = new Container();

favoriteContainer.bind<FavoriteServiceInterface>(Component.FavoriteServiceInterface).to(FavoriteService);
favoriteContainer.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);


export {favoriteContainer};
