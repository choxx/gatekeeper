import { Injectable } from '@nestjs/common';

@Injectable()
export class GlobalService {
  static isConfigRequestBlocked = false;
}
