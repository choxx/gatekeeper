import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyAuthGuard } from './auth/guard/apikey-auth.guard';
import { AdminSecretAuthGuard } from './auth/guard/admin-secret-auth.guard';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Controller()
@UseGuards(ApiKeyAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getHealth(): string {
    return 'ok';
  }

  @Get('/gatekeeper')
  getSystemStatus(@Headers('x-application-id') applicationId: string): object {
    return this.appService.getSystemStatus(applicationId);
  }

  @Post('/configuration')
  @UseGuards(AdminSecretAuthGuard)
  updateConfiguration(
    @Headers('x-application-id') applicationId: string,
    @Body() body: UpdateConfigurationDto,
  ): object {
    return this.appService.updateConfiguration(applicationId, body);
  }
}
