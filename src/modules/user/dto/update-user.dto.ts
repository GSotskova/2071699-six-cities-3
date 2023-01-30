import {IsString} from 'class-validator';

export default class UpdateUserDto {

  @IsString({message: 'avatarPath is required'})
  public avatarPath?: string;
}
