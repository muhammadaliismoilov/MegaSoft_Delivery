import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { WeekDays } from '@delivery/db/db/enums/base.enum';
import { format } from 'date-fns';

export class RestaurantResponseDto {
   id: string;

  name: string;
  address: string;
  description: string;

  @Expose({ name: 'image_url', toPlainOnly: true })
  imageUrl: string;
  lat: number;
  long: number;

  @Expose({ name: 'free_delivery', toPlainOnly: true })
  freeDelivery: boolean;

  @Expose({ name: 'is_open', toPlainOnly: true })
  isOpen: boolean;

    @Expose({ name: 'created_at', toPlainOnly: true })
  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  createdAt: Date;
  @Expose({ name: 'updated_at', toPlainOnly: true })
  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  updatedAt: Date;
}

export class RestaurantCreateDto {
  @ApiProperty({ example: 'Mega Pizza', description: 'Restoran nomi' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Toshkent sh., Chilonzor',
    description: 'Restoran manzili',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: '7a3c5e47-6e23-4fd7-91c1-123456789abc',
    description: 'Tashkilot ID (UUID)',
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    example: 'Oilaviy restoran, pizza va burgerlar',
    description: 'Tavsif',
  })
  @IsString()
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Restoran rasmi (fayl)',
  })
  @IsOptional()
  image?: any;

  @ApiProperty({ example: 41.311081, description: 'Latitude koordinatasi' })
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 69.240562, description: 'Longitude koordinatasi' })
  @Type(() => Number)
  @IsNumber()
  long: number;

  @ApiProperty({
    example: true,
    description: 'Bepul yetkazib berish (default = false)',
    default: false,
  })
  @IsOptional()
  //   @IsBoolean()
  freeDelivery?: boolean;

   @ApiProperty({
    type: String,
    description: 'Hafta kunlarini vergul bilan yozing (monday, tuesday, wednesday, thursday, friday, saturday, sunday)',
    example: 'monday, tuesday, friday',
  })
  @Transform(({ value }) =>
    value.split(',').map((v: string) => v.trim().toLowerCase()),
  )
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(WeekDays, {
    each: true,
    message:
      'Faqat to‘g‘ri hafta kunlari yozilishi kerak (monday, tuesday, wednesday, thursday, friday, saturday, sunday)',
  })
  dayOfWeek: WeekDays[];

  @ApiPropertyOptional({
    description: 'Ochilish vaqti (HH:mm format)',
    example: '09:00',
    type: String,
    format: 'time', // Swagger time picker uchun
  })
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional({
    description: 'Yopilish vaqti (HH:mm format)',
    example: '18:00',
    type: String,
    format: 'time', // Swagger time picker uchun
  })
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiProperty({
    example: true,
    description: 'Restoran ochiqligi (default = true)',
    default: true,
  })
  @IsOptional()
    // @IsBoolean()
  isOpen?: boolean;

  
}

export class RestaurantUpdateDto {
  @ApiPropertyOptional({ description: 'Restoran nomi' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Restoran manzili' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Tashkilot ID (UUID)' })
  //   @IsUUID()
  @IsOptional()
  organizationId?: string;

  @ApiPropertyOptional({ description: 'Restoran tavsifi' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Restoran rasmi (fayl)',
  })
  @IsOptional()
  image?: any;

  @ApiPropertyOptional({ description: 'Latitude (geolokatsiya)' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  lat?: number;

  @ApiPropertyOptional({ description: 'Longitude (geolokatsiya)' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  long?: number;

  @ApiPropertyOptional({
    description: 'Bepul yetkazib berish (default: false)',
  })
  //   @IsBoolean()
  @IsOptional()
  freeDelivery?: boolean;

  @ApiPropertyOptional({
    description: 'Restoran ochiqmi (default: false)',
  })
  //   @IsBoolean()
  @IsOptional()
  isOpen?: boolean;
}
