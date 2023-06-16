import { Injectable } from '@nestjs/common';
import { AppService } from './app.service';

@Injectable()
export class LockService {
  static locks: Record<string, boolean>[] = [];

  constructor(private readonly appService: AppService) {
    const appIds = appService.getAppIds();

    for (const appId of appIds) {
      LockService.locks[appId] = false;
    }
  }
}
