import {IsEmail, IsString, Length, IsEnum} from 'class-validator';
import { UserType } from '../../../types/user-type.enum.js';

export default class CreateUserDto {

  @IsString({message: 'name is required'})
  @Length(1, 15, {message: 'Min length is 1, max is 15'})
  public name!: string ;

  @IsEmail({}, {message: 'email must be valid address'})
  public email!: string;

  @IsString({message: 'avatarPath is required'})
  public avatarPath!: string;

  @IsEnum(UserType, {message: 'type must be one of pro or standart'})
  public userType!: UserType;

  @IsString({message: 'password is required'})
  @Length(6, 12, {message: 'Min length for password is 6, max is 12'})
  public password!: string;
}
