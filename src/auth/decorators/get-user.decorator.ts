import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioEntity } from '../../database/entities/usuario.entity';

export const GetUser = createParamDecorator(
  (data: keyof UsuarioEntity | undefined, ctx: ExecutionContext): UsuarioEntity | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);