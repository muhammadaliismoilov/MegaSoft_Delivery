import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Ko‘p tilli nomlar uchun DTO
//  */
// class TranslatableDto {
//   @ApiProperty({ example: 'MegaSoft', description: 'Tashkilot nomi (O‘zbekcha)' })
//   @IsNotEmpty({ message: 'O‘zbekcha nom bo‘sh bo‘lmasligi kerak' })
//   @IsString({ message: 'O‘zbekcha nom matn bo‘lishi kerak' })
//   uz: string;

//   @ApiProperty({ example: 'МегаСофт', description: 'Tashkilot nomi (Ruscha)' })
//   @IsNotEmpty({ message: 'Ruscha nom bo‘sh bo‘lmasligi kerak' })
//   @IsString({ message: 'Ruscha nom matn bo‘lishi kerak' })
//   ru: string;

//   @ApiProperty({ example: 'MegaSoft', description: 'Tashkilot nomi (Inglizcha)' })
//   @IsNotEmpty({ message: 'Inglizcha nom bo‘sh bo‘lmasligi kerak' })
//   @IsString({ message: 'Inglizcha nom matn bo‘lishi kerak' })
//   en: string;
// }

// /**
//  * Yangi tashkilot qo‘shish uchun DTO
//  */
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
