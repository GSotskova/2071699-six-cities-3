import {injectable, inject} from 'inversify';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {ConfigInterface} from '../common/config/config.interface.js';
import { Component } from '../types/component.types.js';

@injectable()
export default class Application {
  private logger!: LoggerInterface;
  private config!: ConfigInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface, @inject(Component.ConfigInterface) config: ConfigInterface) {
    this.logger = logger;
    this.config = config;
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info(`Get value from env $SALT: ${this.config.get('SALT')}`);
    this.logger.info(`Get value from env $DB_HOST: ${this.config.get('DB_HOST')}`);
  }
}
