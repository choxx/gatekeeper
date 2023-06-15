import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigResolverService } from './config.resolver.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './task.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigResolverService, TasksService],
  exports: [AppService, ConfigResolverService],
})
export class AppModule {}
