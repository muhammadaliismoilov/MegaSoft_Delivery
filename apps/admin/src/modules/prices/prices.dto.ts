import { PartialType } from '@nestjs/swagger';
import { DiscountEnum } from '@delivery/db/db/enums/base.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';



export class PriceResponseDto {
  @Expose({ name: 'id', toPlainOnly: true })
  @IsUUID()
  @ApiProperty({
    example: 'c21f969b-5f03-4338-9f9a-123456789abc',
    description: 'Narx ID',
  })
  id: string;

  @Expose({ name: 'product_id', toPlainOnly: true })
  @IsUUID()
  @ApiProperty({
    example: 'a91fbb0b-12d0-48a1-9c0c-7fd0f86b5e22',
    description: 'Mahsulot ID',
  })
  productId: string;

  @Expose({ name: 'price', toPlainOnly: true })
  @IsNumber()
  @ApiProperty({ example: 25000, description: 'Mahsulot narxi (so‘mda)' })
  price: number;

  @Expose({ name: 'discount_type', toPlainOnly: true })
  @IsEnum(DiscountEnum)
  @ApiProperty({
    example: 'PERCENT',
    description: 'Chegirma turi (PERCENT yoki AMOUNT)',
    enum: DiscountEnum,
    required: false,
  })
  discountType: DiscountEnum;

  @Expose({ name: 'discount_value', toPlainOnly: true })
  @ApiProperty({
    example: 10.5,
    description: 'Chegirma qiymati (foiz yoki summa)',
    required: false,
  })
  discountValue: number;

  @Expose({ name: 'last_price', toPlainOnly: true })
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Bu mahsulotning oxirgi narximi yoki yo‘q',
  })
  lastPrice: boolean;

}



export class CreatePriceDto {
  @ApiProperty({
    example: 'a3e2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'Mahsulotning UUID',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 150000,
    description: 'Narx (so‘mda)',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    enum: DiscountEnum,
    example: DiscountEnum.AMOUNT,
    description: 'Chegirma turi (foiz yoki summa)',
    required: false,
  })
  @IsOptional()
  @IsEnum(DiscountEnum)
  discountType?: DiscountEnum;

  @ApiProperty({
    example: 10,
    description: 'Chegirma qiymati (agar mavjud bo‘lsa)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @ApiProperty({
    example: true,
    description: 'Oxirgi narx belgisi',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  lastPrice?: boolean;
}



export class UpdatePriceDto extends PartialType(CreatePriceDto) {}
