import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsObject,
  IsJSON,
} from 'class-validator';


export class OrganizationProductResponseDto {
  @Expose({ name: 'id', toPlainOnly: true })
  @IsUUID()
  @ApiProperty({ example: 'd91a7e9f-2a8c-4b83-8a15-123456789abc', description: 'Mahsulot ID' })
  id: string;

  @Expose({ name: 'food_type_id', toPlainOnly: true })
  @IsUUID()
  @ApiProperty({ example: '7a3c5e47-6e23-4fd7-91c1-123456789abc', description: 'Ovqat turi ID' })
  foodTypeId: string;

  @Expose({ name: 'organization_id', toPlainOnly: true })
  @IsUUID()
  @ApiProperty({ example: 'e91fbb0b-44d0-48a1-8c0c-7fd0f86b5e22', description: 'Tashkilot ID' })
  organizationId: string;

  @Expose({ name: 'title', toPlainOnly: true })
  @IsObject()
  @ApiProperty({
    example: { uz: 'Lavash', ru: 'Лаваш', en: 'Lavash' },
    description: 'Mahsulot nomi (ko‘p tillarda)',
  })
  title: { uz: string; ru: string; en: string };

  @Expose({ name: 'image', toPlainOnly: true })
  @IsString()
  @ApiProperty({ example: '/uploads/products/lavash.png', description: 'Mahsulot rasmi URL' })
  image: string;

  @Expose({ name: 'description', toPlainOnly: true })
  @IsObject()
  @ApiProperty({
    example: { uz: 'Mazali lavash', ru: 'Вкусный лаваш', en: 'Delicious lavash' },
    description: 'Mahsulot tavsifi (ko‘p tillarda)',
  })
  description: { uz: string; ru: string; en: string };

  @Expose({ name: 'is_active', toPlainOnly: true })
  @ApiProperty({ example: true, description: 'Mahsulot faolmi yoki yo‘q' })
  isActive: boolean;

  // @Expose({ name: 'sequence', toPlainOnly: true })
  // @Type(() => Number)
  // @IsNumber()
  // @ApiProperty({ example: 1, description: 'Tartib raqami' })
  // sequence: number;


}


export class CreateOrganizationProductDto {
  @ApiProperty({
    example: '7a3c5e47-6e23-4fd7-91c1-123456789abc',
    description: 'Food ID (agar bog‘langan bo‘lsa)',
    required: true,
  })
  @IsOptional()
  @IsUUID()
  food_type_id?: string;

  @ApiProperty({
    example: '7a3c5e47-6e23-4fd7-91c1-987654321abc',
    description: 'Tashkilot ID (majburiy)',
  })
  @IsNotEmpty()
  @IsUUID()
  organization_id: string;

  @ApiProperty({
    example: { uz: 'Lavash', ru: 'Лаваш', en: 'Lavash' },
    description: 'Mahsulot nomi (JSON formatda, 3 tilda)',
  })
  @IsNotEmpty()
  @IsJSON()
  title: { uz: string; ru: string; en: string };

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ovqat rasmi (fayl)',
  })
  image: any;

  @ApiProperty({
    example: {
      uz: 'Mazali lavash',
      ru: 'Вкусный лаваш',
      en: 'Delicious lavash',
    },
    description: 'Mahsulot tavsifi (JSON formatda, 3 tilda)',
  })
  @IsNotEmpty()
  @IsJSON()
  description: { uz: string; ru: string; en: string };
}

export class UpdateOrganizationProductDto {
  @ApiPropertyOptional({
    example: 'f13e9f63-4a2b-47c3-9c8b-2f9a8b8d7f13',
    description: 'Ovqat ID (Foods jadvalidan)',
  })
  @IsOptional()
  food_type_id?: string;

  @ApiPropertyOptional({
    example: 'e91fbb0b-44d0-48a1-8c0c-7fd0f86b5e22',
    description: 'Organizatsiya ID (Organization jadvalidan)',
  })
  @IsOptional()
  organization_id?: string;

  @ApiPropertyOptional({
    example: { uz: 'Osh', ru: 'Плов', en: 'Pilaf' },
    description: 'Mahsulot nomi (ko‘p tillarda)',
  })
  @IsOptional()
  title?: { uz: string; ru: string; en: string };

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ovqat rasmi (fayl)',
    required: false,
  })
  image?: any;

  @ApiPropertyOptional({
    example: { uz: 'Mazali osh', ru: 'Вкусный плов', en: 'Delicious pilaf' },
    description: 'Mahsulot tavsifi (ko‘p tillarda)',
  })
  @IsOptional()
  description?: { uz: string; ru: string; en: string };
}
