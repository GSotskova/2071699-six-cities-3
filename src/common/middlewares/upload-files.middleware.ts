import {NextFunction, Request, Response} from 'express';
import {nanoid} from 'nanoid';
import multer, {diskStorage} from 'multer';
import mime from 'mime-types';
import {MiddlewareInterface} from '../../types/middleware.interface.js';
import { IMAGES_OFFER_COUNT } from '../../modules/offer/offer.constant.js';

export class UploadFilesMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const extension = mime.extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${extension}`);
      }
    });

    const uploadSingleFilesMiddleware = multer({storage}).array(this.fieldName, IMAGES_OFFER_COUNT);
    uploadSingleFilesMiddleware(req, res, next);
  }
}
