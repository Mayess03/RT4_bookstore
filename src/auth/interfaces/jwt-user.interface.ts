import { Role } from '../../common/enum/role.enum';

export interface JwtUser {
  userId: string;
  role: Role;
}
