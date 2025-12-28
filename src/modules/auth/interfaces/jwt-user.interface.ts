import { Role } from '../../../common/enums/role.enum';

export interface JwtUser {
  userId: string;
  role: Role;
}
