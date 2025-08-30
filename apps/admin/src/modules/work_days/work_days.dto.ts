import { Transform } from 'class-transformer';
import { 
  IsBoolean, 
  IsDate, 
  IsEnum, 
  IsOptional, 
  IsString, 
  IsUUID 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { format } from 'date-fns';
import { WeekDays } from '@delivery/db/db/enums/base.enum';


export class WorkDaysResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ enum: WeekDays })
  @IsEnum(WeekDays)
  dayOfWeek: WeekDays;

  @ApiPropertyOptional({ description: 'Opening time in HH:mm format' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional({ description: 'Closing time in HH:mm format' })
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiProperty()
  @IsBoolean()
  isClosed: boolean;

  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  createdAt: Date;

  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  updatedAt: Date;
}

export class WorkDaysCreateDto {
  @ApiProperty()
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ enum: WeekDays })
  @IsEnum(WeekDays)
  dayOfWeek: WeekDays;

  @ApiPropertyOptional({ description: 'Opening time in HH:mm format' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional({ description: 'Closing time in HH:mm format' })
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiProperty()
  @IsBoolean()
  isClosed: boolean;
}

export class WorkDaysUpdateDto {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  restaurantId?: string;

  @ApiPropertyOptional({ enum: WeekDays })
  @IsEnum(WeekDays)
  @IsOptional()
  dayOfWeek?: WeekDays;

  @ApiPropertyOptional({ description: 'Opening time in HH:mm format' })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional({ description: 'Closing time in HH:mm format' })
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isClosed?: boolean;
}
