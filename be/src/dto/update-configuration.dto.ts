import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject, IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";

export enum ERROR_TYPE {
  SERVER_UPGRADE = 'SERVER_UPGRADE',
  PERFORMANCE_DEGRADE = 'PERFORMANCE_DEGRADE',
  SYSTEM_OFFLINE = 'SYSTEM_OFFLINE',
  ACCESS_BLOCK = 'ACCESS_BLOCK',
}

export enum ERROR_ACTION {
  DISMISS = 'DISMISS',
  DESTRUCT = 'DESTRUCT',
}

export class ErrorDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsIn([ERROR_TYPE.SERVER_UPGRADE, ERROR_TYPE.PERFORMANCE_DEGRADE, ERROR_TYPE.SYSTEM_OFFLINE, ERROR_TYPE.ACCESS_BLOCK])
  type: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsIn([ERROR_ACTION.DISMISS, ERROR_ACTION.DESTRUCT])
  action: string;
}

export class CronDto {
  @IsDefined()
  @IsBoolean()
  blocked: boolean;
}

export class SystemDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ErrorDto || null)
  error: ErrorDto | null;

}

export class ActorsDto {
  @IsDefined()
  @IsNotEmpty()
  id: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ErrorDto)
  error: ErrorDto;
}

export class UpdateConfigurationDto {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CronDto)
  cron: CronDto;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => SystemDto)
  system: SystemDto;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActorsDto)
  actors: ActorsDto[]
}