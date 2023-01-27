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


@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for OfferController...');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/create', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/favorite', method: HttpMethod.Get, handler: this.getFavotite});
    this.addRoute({path: '/:offerid', method: HttpMethod.Get, handler: this.getOne});
    this.addRoute({path: '/favorite/:offerid/:status', method: HttpMethod.Patch, handler: this.setStatusFavotite});
    this.addRoute({path: '/:cityname', method: HttpMethod.Get, handler: this.getPremium});
    this.addRoute({path: '/:offerid', method: HttpMethod.Patch, handler: this.edit});
    this.addRoute({path: '/:offerid', method: HttpMethod.Delete, handler: this.delete});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const offerResponse = fillDTO(OfferResponse, offers);
    this.send(res, StatusCodes.OK, offerResponse);
  }

  public async create(
    {body}: Request<Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const existsOffer = await this.offerService.findByTitle(body.title);

    if (existsOffer) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `Offer with title ${body.title} exists.`,
        'OfferController'
      );
    }

    const result = await this.offerService.create(body);
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(OfferResponse, result)
    );
  }

  public async getOne (req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerid);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerid} not found.`,
        'OfferController'
      );
    }

    this.ok(res, offer);
  }

  public async edit(
    req: Request,
    res: Response,
  ): Promise<void> {
    const offer = await this.offerService.updateById(req.params.offerid, req.body);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerid} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferResponse, offer));
  }

  public async delete(req: Request, res: Response,): Promise<void> {
    const offer = await this.offerService.deleteById(req.params.offerid);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerid}  not found.`,
        'OfferController'
      );
    }

    this.noContent(res, offer);
  }

  public async getPremium (req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findPremium(req.params.cityname);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Premium offer with city ${req.params.cityname} not found.`,
        'OfferController'
      );
    }

    this.ok(res, offer);
  }


  public async getFavotite (_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorite();
    if (!offers) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'Favorite offers not found.',
        'OfferController'
      );
    }

    this.ok(res, offers);
  }

  public async setStatusFavotite(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.editStatusFavorite(req.params.offerid);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${req.params.offerid} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferResponse, offer));
  }

}
