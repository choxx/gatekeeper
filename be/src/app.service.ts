import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";

@Injectable()
export class AppService {
  private configCache: object = {};

  getSystemStatus(applicationId: string, refreshCache: boolean = false): object {
    if (!refreshCache && this.configCache[applicationId]) {
      return this.configCache[applicationId]; // return from cache
    }
    const filePath = `configurations/${applicationId}.json`;
    if (fs.existsSync(filePath)) {
      this.configCache[applicationId] = JSON.parse(fs.readFileSync(filePath, 'utf8'));  // add to cache
      return this.configCache[applicationId];
    }

    // if file doesn't exist, we'll create a default one assuming system in UP
    const dto: UpdateConfigurationDto = {
      cron: {
        blocked: false
      },
      system: {
        error: null
      },
      actors: []
    }
    fs.writeFileSync(filePath, JSON.stringify(dto));
    return dto;
  }

  updateConfiguration(applicationId: string, config: UpdateConfigurationDto): object {
    const filePath = `configurations/${applicationId}.json`;
    fs.writeFileSync(filePath, JSON.stringify(config));
    return this.getSystemStatus(applicationId, true);
  }
}
