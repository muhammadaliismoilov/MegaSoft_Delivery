import { Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { format } from 'date-fns';

export class BannerResponseDto {
  id: string;
  images?: { [lang: string]: string };

  @Expose({ name: 'title', toPlainOnly: true })
  title: string;

  @Expose({ name: 'is_active', toPlainOnly: true })
  isActive: boolean = true;

    
  @Expose({ name: 'restaurant_id', toPlainOnly: true })
  @IsUUID()
  restaurantId: string;

  @Expose({ name: 'product_id', toPlainOnly: true })
  @IsUUID()
  productId: string;

  
  @Expose({ name: 'food_id', toPlainOnly: true })
  @IsUUID()
  foodTypeId: string;

  sequence: number;
  @Expose({ name: 'start_date', toPlainOnly: true })
  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  startDate: Date;

  @Transform(
    ({ value }) =>
      value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    { toPlainOnly: true },
  )
  @Expose({ name: 'end_date', toPlainOnly: true })
  endDate: Date;
}

export class BannerCreateDTO {
  @ApiProperty({ type: String })
  @Expose({ name: 'title', toPlainOnly: true })
  @IsString()
  title: string;
  
  @ApiPropertyOptional({ type: String })
  @Expose({ name: 'restaurant_id', toPlainOnly: true })
 
  @IsOptional()
  restaurantId?: string;

  @ApiPropertyOptional({ type: String })
  @Expose({ name: 'product_id', toPlainOnly: true })
  
  @IsOptional()
  productId?: string;

  @ApiProperty({ type: String })
  @Expose({ name: 'food_type_id', toPlainOnly: true })
  @IsUUID()
  foodTypeId: string;

  @ApiProperty({
    default: true,
  })
  @IsBoolean()
  @Expose({ name: 'is_active', toPlainOnly: true })
  @Type(() => Boolean)
  isActive: boolean = true;
  
  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @Expose({ name: 'start_date', toPlainOnly: true })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  startDate?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @Expose({ name: 'end_date', toPlainOnly: true })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date | null;
}

export class BannerUpdateDTO {
  @ApiProperty({ type: String })
  @Expose({ name: 'title', toPlainOnly: true })
  @IsString()
  @IsOptional()
  @Transform(({ value }): string | null => (value === '' ? null : value))
  title?: string;

    @ApiProperty({ type: String })
  @Expose({ name: 'restaurant_id', toPlainOnly: true })
  @IsUUID()
   @IsOptional()
  restaurantId?: string;

   @ApiProperty({ type: String })
  @Expose({ name: 'product_id', toPlainOnly: true })
  @IsOptional()
  productid?: string;

  @ApiProperty({ type: String })
  @Expose({ name: 'food_type_id', toPlainOnly: true })
  @IsUUID()
  @IsOptional()
  foodTypeId?: string;

  @IsBoolean()
  @IsOptional()
  @Expose({ name: 'is_active', toPlainOnly: true })
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @Expose({ name: 'start_date', toPlainOnly: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @Expose({ name: 'end_date', toPlainOnly: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date | null;
}

export class BannerSequenceDto {
  @ApiProperty({ example: 1, description: 'New sequence index' })
  @IsInt()
  @Min(0, { message: "pozitsiya 0 dan katta bo'lishi kerak" })
  sequence: number;
}
