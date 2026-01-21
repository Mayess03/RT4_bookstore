import { MinLength } from 'class-validator';

export class ResetPasswordDto {
  token: string;

  @MinLength(6)
  newPassword: string;
}
