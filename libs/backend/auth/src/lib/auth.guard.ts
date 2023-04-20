import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ApiAuthGuard extends AuthGuard(['cache', 'apikey', 'jwt']) {
  canActivate(context: ExecutionContext) {
    // exclude healtcheck from auth guard
    if (context.getHandler().name === 'healthcheck')  return true;
    return super.canActivate(context);
  }
}
