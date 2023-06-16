import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { GlobalService } from 'src/global.service';

@Injectable()
export class LockInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // check if request is blocked
    if (GlobalService.isConfigRequestBlocked) {
      throw new ServiceUnavailableException();
    }

    // acquire lock
    GlobalService.isConfigRequestBlocked = true;

    return next.handle().pipe(
      tap(() => {
        // release lock
        GlobalService.isConfigRequestBlocked = false;
      }),
    );
  }
}
