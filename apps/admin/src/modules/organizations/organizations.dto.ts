import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';


export class OrganizationResponseDto {
  @Expose({ name: 'id', toPlainOnly: true })
  @IsUUID()
  @ApiProperty({
    example: '7a3c5e47-6e23-4fd7-91c1-123456789abc',
    description: 'Organizatsiya ID',
  })
  id: string;

  @Expose({ name: 'title', toPlainOnly: true })
  @IsObject()
  @ApiProperty({
    example: { uz: 'MegaFood', ru: 'МегаФуд', en: 'MegaFood' },
    description: 'Organizatsiya nomi (ko‘p tillarda)',
  })
  title: { uz: string; ru: string; en: string };

  @Expose({ name: 'image', toPlainOnly: true })
  @IsString()
  @ApiProperty({
    example: '/uploads/organizations/logo.png',
    description: 'Organizatsiya rasmi URL',
  })
  image: string;


}

export class CreateOrganizationDto {
  @ApiProperty({
    // type: TranslatableDto,/
    description: 'Tashkilot nomi (uz, ru, en tillarda kiritilishi kerak)',
    example: { uz: 'MegaSoft', ru: 'МегаСофт', en: 'MegaSoft' },
  })
  @IsJSON()
  @IsNotEmpty()
  title: { uz: string; ru: string; en: string };

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Tashkilot rasmi (fayl)',
  })
  image: any;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
