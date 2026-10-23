import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../modules/users/user.entity';

export interface JwtUser {
  id: number;
  email: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtUser => ctx.switchToHttp().getRequest().user,
);
