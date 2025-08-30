import { logLevel } from '@delivery/db/db/enums/base.enum';
import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
} from 'class-validator';

export class LogCreateDto {
  @IsString()
  @IsEnum(logLevel)
  level: logLevel;

  @IsString()
  source: string;

  @IsString()
  message: string;

  @Expose({ name: 'ip_address', toPlainOnly: true })
  @IsString()
  @IsOptional()
  ipAddress?: string | null;

  @IsNumber()
  @IsOptional()
  status?: number | null;

  @Expose({ name: 'user_agent', toPlainOnly: true })
  @IsOptional()
  @IsString()
  userAgent?: string | null;

  @Expose({ name: 'user_id', toPlainOnly: true })
  @IsOptional()
  @IsUUID()
  userId?: string | null;

  @Expose({ name: 'user_name', toPlainOnly: true })
  @IsOptional()
  @IsString()
  userName?: string | null;

  @Expose({ name: 'user_role', toPlainOnly: true })
  @IsOptional()
  @IsString()
  userRole?: string | null;

  @IsOptional()
  @IsString()
  curl?: string | null;

  @IsOptional()
  @IsObject()
  context?: Record<string, any> | null;
}
