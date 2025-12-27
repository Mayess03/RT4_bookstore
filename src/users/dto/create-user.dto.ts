import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { Role } from '../../common/enum/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  role?: Role;
}
