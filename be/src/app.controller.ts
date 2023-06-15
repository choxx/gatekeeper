import { Body, Controller, Get, Headers, Ip, Post, UseGuards } from "@nestjs/common";
import { AppService } from './app.service';
import { ApiKeyAuthGuard } from "./auth/guard/apikey-auth.guard";
import { AdminSecretAuthGuard } from "./auth/guard/admin-secret-auth.guard";
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";
import { Throttle } from "@nestjs/throttler";

@Controller()
@UseGuards(ApiKeyAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  getHealth(@Ip() ip): string {
    console.log(`Client IP: ${ip}`);
    return 'ok';
  }

  @Get('/gatekeeper')
  getSystemStatus(
    @Headers('x-application-id') applicationId: string,
  ): object {
    return this.appService.getSystemStatus(applicationId);
  }

  @Post('/configuration')
  @Throttle(5, 60)
  @UseGuards(AdminSecretAuthGuard)
  updateConfiguration(
    @Headers('x-application-id') applicationId: string,
    @Body() body: UpdateConfigurationDto
  ): object {
    return this.appService.updateConfiguration(applicationId, body);
  }
}
