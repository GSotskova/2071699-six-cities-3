import {defaultClasses} from '@typegoose/typegoose';
import typegoose, {getModelForClass} from '@typegoose/typegoose';
import {LocationType} from '../../types/location-type.js';

const {prop, modelOptions} = typegoose;

export interface LocationEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'locations'
  }
})
export class LocationEntity extends defaultClasses.TimeStamps implements LocationType {
  @prop({required: true})
  public city!: string;

  @prop({required: true})
  public latitude!: number;

  @prop({required: true})
  public longitude!: number;
}

export const LocationModel = getModelForClass(LocationEntity);
