import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ReadUserDto } from 'src/modules/user/dto/read-user.dto';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user: Partial<ReadUserDto> = request.user.user;
    return user;
  },
);
