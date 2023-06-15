import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { UpdateConfigurationDto } from "./dto/update-configuration.dto";

@Injectable()
export class AppService {
  getSystemStatus(applicationId: string): object {
    // TODO add caching
    const filePath = `configurations/${applicationId}.json`;
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
    // TODO update cache
    const filePath = `configurations/${applicationId}.json`;
    fs.writeFileSync(filePath, JSON.stringify(config));
    return this.getSystemStatus(applicationId);
  }
}
