import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { format } from 'date-fns';
import { DiscountEnum } from '@delivery/db/db/enums/base.enum';

export class ProductPriceDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsEnum(DiscountEnum)
  discountType?: string;

  @ApiPropertyOptional()
  @IsNumber()
  discountValue?: number;

  @Transform(({ value }) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null, { toPlainOnly: true })
  createdAt: Date;

  @Transform(({ value }) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null, { toPlainOnly: true })
  updatedAt: Date;
}

export class ProductWeighDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsNumber()
  weigh: number;

  @Transform(({ value }) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null, { toPlainOnly: true })
  createdAt: Date;

  @Transform(({ value }) => value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null, { toPlainOnly: true })
  updatedAt: Date;
}

export class ProductResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
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
  @Min(0)
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional({ enum: DiscountEnum })
  @IsOptional()
  @IsEnum(DiscountEnum)
  discountType?: DiscountEnum;

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
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ enum: DiscountEnum })
  @IsOptional()
  @IsEnum(DiscountEnum)
  discountType?: DiscountEnum;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  discountValue?: number;

  @ApiPropertyOptional({ type: [Number], description: 'Updated weighs for the product' })
  @IsOptional()
  weighs?: number[];
}
