import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { format } from 'date-fns';
import { DiscountEnum } from '@delivery/db/db/enums/base.enum';

export class ProductPriceDto {
  @ApiProperty()
  @IsUUID()
  product_id: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiPropertyOptional()
  @IsEnum(DiscountEnum)
  discountType?: string;

  @ApiPropertyOptional()
  @IsNumber()
  discountValue?: number;

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

export class ProductWeighDto {
  @ApiProperty()
  @IsUUID()
  product_id: string;

  
  @ApiProperty()
  @IsNumber()
  weigh: number;

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

export class ProductResponseDto {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  restaurantId: string;

  @ApiProperty()
  @IsUUID()
  organization_product_id: string;

  @ApiProperty()
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  newUntil: Date;

  @ApiProperty({ type: [ProductPriceDto] })
  prices: ProductPriceDto[];

  @ApiProperty({ type: [ProductWeighDto] })
  weighs: ProductWeighDto[];
}


export class ProductCreateDto {
  @ApiProperty({
    description: 'Restoran ID (UUID formatda bo‘lishi kerak)',
    example: '7a3c5e47-6e23-4fd7-91c1-123456789abc',
  })
  @IsUUID()
  restaurant_id: string;

  @ApiProperty({
    description: 'Organizatsiya mahsuloti ID (UUID format)',
    example: '8b9c5e47-6e23-4fd7-91c1-654321abcdef',
  })
  @IsUUID()
  organization_product_id: string;

  @ApiProperty({
    description: 'Mahsulot mavjudligini ko‘rsatadi (true/false)',
    example: true,
  })
  @IsBoolean({ message: 'isAvailable qiymati true yoki false bo‘lishi kerak' })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Mahsulot yangilik sifatida ko‘rsatiladigan oxirgi sana',
    example: '2025-09-03T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate({ message: 'NewUntil sana formatida bo‘lishi kerak' })
  newUntil: Date;

  @ApiProperty({
    description: 'Mahsulot narxi (butun son bo‘lishi kerak)',
    example: 25000,
  })
  @IsInt({ message: 'Narx butun son bo‘lishi kerak' })
  @Min(0, { message: 'Narx 0 dan kichik bo‘lishi mumkin emas' })
  price: number;

  @ApiPropertyOptional({
    description: 'Chegirma turi (foiz yoki summa)',
    enum: DiscountEnum,
    example: DiscountEnum.AMOUNT,
  })
  @IsOptional()
  @IsEnum(DiscountEnum, { message: 'Chegirma turi noto‘g‘ri tanlangan' })
  discountType?: DiscountEnum;

  @ApiPropertyOptional({
    description: 'Chegirma qiymati (butun son bo‘lishi kerak)',
    example: 15,
  })
  @IsOptional()
  @IsInt({ message: 'Chegirma qiymati butun son bo‘lishi kerak' })
  discountValue?: number;

  @ApiProperty({
    type: [Number],
    description: 'Mahsulot og‘irliklari ro‘yxati (grammlarda)',
    example: [300, 500, 1000],
  })
  @IsOptional()
  weighs?: number[];
}


export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Restoran ID (UUID formatda bo‘lishi kerak)',
    example: '7a3c5e47-6e23-4fd7-91c1-123456789abc',
  })
  @ValidateIf((o) => o.restaurant_id !== '' && o.restaurant_id !== null && o.restaurant_id !== undefined)
  
  @IsUUID('4', { message: 'Restoran ID noto‘g‘ri formatda' })
  restaurant_id?: string;

  @ApiPropertyOptional({
    description: 'Organizatsiya mahsuloti ID (UUID format)',
    example: '8b9c5e47-6e23-4fd7-91c1-654321abcdef',
  })
  @ValidateIf((o) => o.organization_product_id !== '' && o.organization_product_id !== null && o.organization_product_id !== undefined)
  
  @IsUUID('4', { message: 'Organizatsiya mahsuloti ID noto‘g‘ri formatda' })
  organization_product_id?: string;

  @ApiPropertyOptional({
    description: 'Mahsulot mavjudligini ko‘rsatadi (true/false)',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isAvailable qiymati true yoki false bo‘lishi kerak' })
  isAvailable?: boolean;

  @ApiPropertyOptional({
    description: 'Mahsulot yangilik sifatida ko‘rsatiladigan oxirgi sana',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'newUntil sana formatida bo‘lishi kerak' })
  newUntil?: Date;

  @ApiPropertyOptional({
    description: 'Mahsulot narxi (butun son bo‘lishi kerak)',
    example: 30000,
  })
  @IsOptional()
  @IsInt({ message: 'Narx butun son bo‘lishi kerak' })
  @Min(0, { message: 'Narx 0 dan kichik bo‘lishi mumkin emas' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Chegirma turi (foiz yoki summa)',
    enum: DiscountEnum,
    example: DiscountEnum.AMOUNT,
  })
  @IsOptional()
  @IsEnum(DiscountEnum, { message: 'Chegirma turi noto‘g‘ri tanlangan' })
  discountType?: DiscountEnum;

  @ApiPropertyOptional({
    description: 'Chegirma qiymati (butun son bo‘lishi kerak)',
    example: 10,
  })
  @IsOptional()
  @IsInt({ message: 'Chegirma qiymati butun son bo‘lishi kerak' })
  discountValue?: number;

  @ApiPropertyOptional({
    type: [Number],
    description: 'Mahsulot og‘irliklari ro‘yxati (grammlarda)',
    example: [250, 400, 800],
  })
  @IsOptional()
  weighs?: number[];
}
