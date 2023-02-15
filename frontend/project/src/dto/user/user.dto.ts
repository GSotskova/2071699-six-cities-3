import { UserTypeServer } from '../../types/user-type.enum.js';

export default class UserDto {

  public name!: string ;

  public email!: string;

  public userType!: UserTypeServer;

  public avatarPath!: string;
}
