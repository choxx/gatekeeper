import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './api.interface';

@Injectable()
export class AppService {
  private configCache: object = {};

  constructor(private readonly configService: ConfigService) {}

  getSystemStatus(
    applicationId: string,
    refreshCache: boolean = false,
  ): UpdateConfigurationDto {
    if (!refreshCache && this.configCache[applicationId]) {
      return this.configCache[applicationId]; // return from cache
    }
    const filePath = `configurations/${applicationId}.json`;
    if (fs.existsSync(filePath)) {
      this.configCache[applicationId] = JSON.parse(
        fs.readFileSync(filePath, 'utf8'),
      ); // add to cache
      return this.configCache[applicationId];
    }

    // if file doesn't exist, we'll create a default one assuming system in UP
    const dto: UpdateConfigurationDto = {
      cron: {
        blocked: false,
      },
      system: {
        error: null,
      },
      actors: [],
    };
    fs.writeFileSync(filePath, JSON.stringify(dto));
    return dto;
  }

  updateConfiguration(
    applicationId: string,
    config: UpdateConfigurationDto,
  ): object {
    const filePath = `configurations/${applicationId}.json`;
    fs.writeFileSync(filePath, JSON.stringify(config));
    return this.getSystemStatus(applicationId, true);
  }

  getAppConfig(appId): AppConfig {
    return JSON.parse(this.configService.getOrThrow(`APP_${appId}`));
  }
}
