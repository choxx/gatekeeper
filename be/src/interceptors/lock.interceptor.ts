import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { ConfigResolverService } from 'src/config.resolver.service';
import { LockService } from 'src/lock.service';

@Injectable()
export class LockInterceptor implements NestInterceptor {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();

    const appId = this.configResolverService
      .transform(<string>req.headers['x-application-id'])
      .split('APP_')[1];

    // check if request is blocked
    if (LockService.locks[appId]) {
      throw new ServiceUnavailableException(`App ${appId} is currently locked`);
    }

    // acquire lock
    LockService.locks[appId] = true;

    return next.handle().pipe(
      tap(() => {
        // release lock
        LockService.locks[appId] = false;
      }),
    );
  }
}
