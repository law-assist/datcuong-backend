import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';

export const GuardsProvider = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
  // {
  //   provide: APP_GUARD,
  //   useClass: ResourceGuard,
  // },
  {
    provide: APP_GUARD,
    useClass: RoleGuard,
  },
];
