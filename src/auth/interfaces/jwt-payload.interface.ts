import { Role } from '../../common/enum/role.enum';

export interface JwtPayload {
  sub: string;   // user id
  role: Role;
}
