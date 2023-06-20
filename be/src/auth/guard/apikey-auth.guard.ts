import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigResolverService } from '../../config.resolver.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const xApiKey = request.headers['x-api-key'];
    const xApplicationId = request.headers['x-application-id'];
    if (!xApplicationId) {
      throw new UnauthorizedException('Missing Application ID Header.');
    }
    if (!xApiKey) {
      throw new UnauthorizedException('Missing API Key.');
    }

    if (xApiKey !== this.configResolverService.getApiKey(xApplicationId)) {
      throw new UnauthorizedException('Invalid API Key.');
    }
    return true;
  }
}
