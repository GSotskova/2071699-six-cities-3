import * as core from 'express-serve-static-core';
import {Controller} from '../../common/controller/controller.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import CreateOfferDto from './dto/create-offer.dto.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../utils/common.js';
import OfferResponse from './response/offer.response.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {RequestQuery} from '../../types/request-query.type.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import { FavoriteServiceInterface } from '../favorite/favorite-service.interface.js';
import FavoriteResponse from '../favorite/response/favorite.response.js';

type ParamsGetOffer = {
  offerId: string;
}

type ParamsGetPremium = {
  cityName: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({path: '/favorite', method: HttpMethod.Get, handler: this.showFavorite});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Patch,
      handler: this.setStatusFavotite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({path: '/premium/:cityName', method: HttpMethod.Get, handler: this.showPremium});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async index(
    req: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const {query, user} = req;
    const offers = await this.offerService.find(user?.id, query?.limit);
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const {body, user} = req;
    const result = await this.offerService.create({...body, userId: user.id});
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferResponse, offer));
  }

  public async show (
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.findById(offerId);
    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferResponse, updatedOffer));
  }


  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.deleteById(offerId);
    this.noContent(res, offer);
  }

  public async showPremium (
    {params}: Request<core.ParamsDictionary | ParamsGetPremium>,
    res: Response
  ): Promise<void> {
    const {cityName} = params;
    const offers = await this.offerService.findPremium(cityName);
    if (!offers) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Premium offer with city ${cityName} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferResponse, offers));
  }


  public async showFavorite (_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorite();
    if (!offers) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Favorite offers not found.',
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async setStatusFavotite(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const {params, user} = req;
    const offerCheck = await this.favoriteService.find(user.id, params.offerId);
    if (!offerCheck) {
      const favorite = await this.favoriteService.create({userId: user.id, offerId: params.offerId});
      await this.offerService.editStatusFavorite(params.offerId);
      console.log(favorite);
      this.created(res, fillDTO(FavoriteResponse, favorite));
    }
    else {
      const favorite = await this.favoriteService.deleteById(user.id, params.offerId);
      await this.offerService.editStatusFavorite(params.offerId);
      this.noContent(res, favorite);
    }

  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
