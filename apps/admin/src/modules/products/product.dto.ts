import {  Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { format } from 'date-fns';

export class ProductPriceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  discountType?: string;

  @ApiPropertyOptional()
  discountValue?: number;

  @ApiProperty({ description: 'Indicates if this is the last price' })
  lastPrice: boolean;

  @Transform(({ value }) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null, { toPlainOnly: true })
  createdAt: Date;

  @Transform(({ value }) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null, { toPlainOnly: true })
  updatedAt: Date;
}

export class ProductWeighDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  weigh: number;

  @Transform(({ value }) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null, { toPlainOnly: true })
  createdAt: Date;

  @Transform(({ value }) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null, { toPlainOnly: true })
  updatedAt: Date;
}

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiProperty({ type: [ProductPriceDto] })
  prices: ProductPriceDto[];

  @ApiProperty({ type: [ProductWeighDto] })
  weighs: ProductWeighDto[];
}


export class ProductCreateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ type: Number })
  @IsInt()
  price: number;

  @ApiPropertyOptional({ enum: ['PERCENTAGE', 'FIXED_AMOUNT'] })
  @IsOptional()
  discountType?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  discountValue?: number;

  @ApiProperty({ type: [Number], description: 'List of weighs for the product' })
  @IsOptional()
  weighs?: number[];
}


export class ProductUpdateDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ enum: ['PERCENTAGE', 'FIXED_AMOUNT'] })
  @IsOptional()
  discountType?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  discountValue?: number;

  @ApiPropertyOptional({ type: [Number], description: 'Updated weighs for the product' })
  @IsOptional()
  weighs?: number[];
}
