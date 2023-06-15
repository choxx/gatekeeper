import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigResolverService } from "./config.resolver.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ConfigResolverService],
  exports: [AppService, ConfigResolverService]
})
export class AppModule {}
