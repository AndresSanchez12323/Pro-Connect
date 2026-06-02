import { Role } from '../../modules/users/entities/user.entity';

export interface RequestUser {
  id: string;
  role: Role;
}
