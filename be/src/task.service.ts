import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { Observable, firstValueFrom, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ErrorDto } from './dto/update-configuration.dto';
import { MonitoringResponseDto } from './dto/monitoring-response.dto';
import { CronJob } from 'cron';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
    private readonly httpService: HttpService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const job = new CronJob(
      this.configService.getOrThrow('CRON_TIME'),
      this.handleCron.bind(this),
    );
    this.schedulerRegistry.addCronJob('updateConfigCron', job);
    job.start();
  }

  getCpuUsage(appId: string): Observable<AxiosResponse<MonitoringResponseDto>> {
    return this.httpService.get(
      this.appService.getAppConfig(appId)['prometheusUrl'],
    );
  }

  async handleCron() {
    this.logger.debug('CRON started');

    const appIds = Object.keys(process.env)
      .filter((env) => /APP_/.test(env))
      .map((appId) => appId.toLowerCase().split('app_')[1]);

    for (const appId of appIds) {
      const response = await firstValueFrom(
        this.getCpuUsage(appId).pipe(map((res) => res.data)),
      );
      const systemLoad = Math.round(Number(response.data.result[0].value[1]));
      const status = this.appService.getSystemStatus(appId);
      if (status.cron.blocked) {
        this.logger.warn('CRON skipped due to blocked');
        return 'SKIPPED';
      }

      const thresholds = this.appService.getAppConfig(appId).systemThresholds;
      const threshold = <ErrorDto | undefined>thresholds
        .sort((prev: object, curr: object) => {
          return prev['threshold'] - curr['threshold'];
        })
        .reverse()
        .find((e) => e['threshold'] <= systemLoad);

      if (threshold) {
        status.system = {
          error: {
            type: threshold.type,
            title: threshold.title,
            description: threshold.description,
            action: threshold.action,
          },
        };
      }

      this.appService.updateConfiguration(appId, status);
    }

    this.logger.debug('CRON successfully executed');

    return 'DONE';
  }
}
