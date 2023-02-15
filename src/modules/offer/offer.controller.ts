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
import {RequestQuery, RequestQueryPremium} from '../../types/request-query.type.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import CommentResponse from '../comment/response/comment.response.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import {PrivateRouteMiddleware} from '../../common/middlewares/private-route.middleware.js';
import { FavoriteServiceInterface } from '../favorite/favorite-service.interface.js';
import FavoriteResponse from '../favorite/response/favorite.response.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import {UploadFileMiddleware} from '../../common/middlewares/upload-file.middleware.js';
import UploadImageResponse from './response/upload-image.response.js';
import {UploadFilesMiddleware} from '../../common/middlewares/upload-files.middleware.js';
import UploadImagesResponse from './response/upload-images.response.js';

type ParamsGetOffer = {
  offerId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface
  ) {
    super(logger, configService);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/offers/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.showFavorite,
      middlewares: [
        new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/offers/:offerId',
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
      method: HttpMethod.Post,
      handler: this.setStatusFavotite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteStatusFavotite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.showPremium});
    this.addRoute({
      path: '/offers/:offerId',
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
      path: '/offers/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/offers/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/offers/:offerId/previewimage',
      method: HttpMethod.Post,
      handler: this.uploadPrevImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'prevImg'),
      ]
    });
    this.addRoute({
      path: '/offers/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFilesMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
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
    req: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ): Promise<void> {
    const {params, query, user} = req;
    await this.offerService.deleteById(params.offerId);
    const offers = await this.offerService.find(user?.id, query?.limit);
    this.ok(res, fillDTO(OfferResponse, offers));
  }

  public async showPremium (
    req: Request<Record<string, unknown>, unknown, unknown, RequestQueryPremium>,
    res: Response
  ): Promise<void> {
    const {query} = req;
    const city = query.city ? query.city : ' ';
    const offers = await this.offerService.findPremium(city);
    if (!offers) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Premium offer with city ${query.city} not found.`,
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
    if (offerCheck) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Offer already added to Favorites',
        'OfferController'
      );
    }
    await this.favoriteService.create({userId: user.id, offerId: params.offerId});
    const favorite = await this.offerService.editStatusFavorite(params.offerId);
    this.created(res, fillDTO(FavoriteResponse, favorite));

  }

  public async deleteStatusFavotite(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const {params, user} = req;
    const offerCheck = await this.favoriteService.find(user.id, params.offerId);
    if (!offerCheck) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Offer not found in Favorites',
        'OfferController'
      );
    }
    const favorite = await this.offerService.editStatusFavorite(params.offerId);
    await this.favoriteService.deleteById(user.id, params.offerId);
    this.ok(res, fillDTO(OfferResponse, favorite));


  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }

  public async uploadPrevImage(req: Request<core.ParamsDictionary | ParamsGetOffer >, res: Response) {
    const {offerId} = req.params;
    const updateDto = { prevImg: req.file?.filename };


    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageResponse, updateDto));
  }

  public async uploadImages(req: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response) {
    const {offerId} = req.params;
    const fileArray = req.files as Array<Express.Multer.File>;
    const fileNames = fileArray.map((file) => file.filename);

    const updateDto = { image: fileNames};

    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImagesResponse, updateDto));
  }
}
