import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigResolverService } from '../../config.resolver.service';

@Injectable()
export class AdminSecretAuthGuard implements CanActivate {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const xAdminSecret = request.headers['x-admin-secret'];
    const xApplicationId = request.headers['x-application-id'];
    if (!xApplicationId) {
      throw new UnauthorizedException('Missing Application ID Header.');
    }
    if (!xAdminSecret) {
      throw new UnauthorizedException('Missing Admin Secret.');
    }

    if (
      xAdminSecret !== this.configResolverService.getAdminSecret(xApplicationId)
    ) {
      throw new UnauthorizedException('Invalid Admin Secret.');
    }
    return true;
  }
}
