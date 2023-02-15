import { UserTypeServer } from '../../types/user-type.enum.js';

export default class UserWithTokenDto {
  public id!: string;

  public email!: string;

  public avatarPath!: string;

  public name!: string;

  public userType!: UserTypeServer;

  public token!: string;
}
