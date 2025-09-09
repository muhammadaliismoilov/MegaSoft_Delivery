import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsBoolean, IsObject, IsJSON, IsInt, Min, IsNumber, IsString } from 'class-validator';


export class FoodTypeResponseDto {
  @Expose({ name: 'id', toPlainOnly: true })
  @IsString()
  id: string;

  @Expose({ name: 'title', toPlainOnly: true })
  @IsObject()
  title: { uz: string; ru: string; en: string };

  @Expose({ name: 'image', toPlainOnly: true })
  @IsString()
  image: string;

  @Expose({ name: 'is_active', toPlainOnly: true })
  @IsBoolean()
  isActive: boolean;

  @Expose({ name: 'sequence', toPlainOnly: true })
  @Type(() => Number)
  @IsNumber()
  sequence: number;
}


export class CreateFoodTypeDto {
  @ApiProperty({
    description: 'Ovqat nomi ko‘p tillarda',
    example: { uz: 'Pizza', ru: 'Пицца', en: 'Pizza' },
  })
  @IsJSON()
  @IsNotEmpty()
  title: { uz: string; ru: string; en: string };

  @ApiProperty({ type: 'string', format: 'binary', description: 'Ovqat rasmi (fayl)' })
  image: any; // Swagger bilan file upload uchun
}

export class UpdateFoodTypeDto {
  @ApiProperty({
    description: 'Ovqat nomi ko‘p tillarda',
    example: { uz: 'Pizza', ru: 'Пицца', en: 'Pizza' },
    required: false,
  })
  @IsOptional()
  // @IsJSON()
  title?: { uz: string; ru: string; en: string } | string;

  @ApiProperty({ description: 'Ovqat faolmi yoki yo‘q',required: false })
  @IsOptional()

  isActive?: boolean;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Ovqat rasmi (fayl)', required: false })
  @IsOptional()
  image?: any;
}


export class FoodTypeSequenceDto {
  @ApiProperty({
    example: 3,
    description: 'Yangi sequence tartib raqami (1 dan boshlab)',
  })
  @IsInt({ message: 'Sequence butun son bo‘lishi kerak' })
  @Min(1, { message: 'Sequence kamida 1 bo‘lishi kerak' })
  sequence: number;
}