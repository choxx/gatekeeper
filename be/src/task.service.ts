import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { Observable, firstValueFrom, map } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ErrorDto } from './dto/update-configuration.dto';
import { MonitoringResponseDto } from './dto/monitoring-response.dto';
import { CronJob } from 'cron';
import { LockService } from './lock.service';
import { ConfigResolverService } from './config.resolver.service';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configResolverService: ConfigResolverService,
  ) {}

  onModuleInit() {
    const appIds = this.appService.getAppIds();

    for (const appId of appIds) {
      const job = new CronJob(
        this.configResolverService.getCronTime(appId),
        this.handleCron.bind(this, appId),
      );
      this.schedulerRegistry.addCronJob(`cron_${appId}`, job);
      job.start();
    }
  }

  getCpuUsage(appId: string): Observable<AxiosResponse<MonitoringResponseDto>> {
    return this.httpService.get(
      this.configResolverService.getPrometheusUrl(appId),
    );
  }

  async handleCron(appId: string) {
    this.logger.debug(`CRON for app ${appId} started`);

    // check if request is already blocked
    if (LockService.locks[appId]) {
      this.logger.warn(
        `CRON for app ${appId} skipped due to some else is requesting`,
      );
      return 'SKIPPED';
    }

    // acquire lock
    LockService.locks[appId] = true;

    let response: MonitoringResponseDto = null;
    try {
      response = await firstValueFrom(
        this.getCpuUsage(appId).pipe(map((res) => res.data)),
      );
    } catch (err) {
      this.logger.error(`CPU usage API failed, Error: ${err}`);
    }

    const systemLoad = Math.round(Number(response.data.result[0].value[1]));
    const status = this.appService.getSystemStatus(appId);
    if (status.cron.blocked) {
      this.logger.warn(`CRON for app ${appId} skipped due to blocked`);
      return 'SKIPPED';
    }

    const thresholds = this.configResolverService.getSystemThresholds(appId);
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

    // release lock
    LockService.locks[appId] = false;

    this.logger.debug(`CRON for app ${appId} successfully executed`);

    return 'DONE';
  }
}
