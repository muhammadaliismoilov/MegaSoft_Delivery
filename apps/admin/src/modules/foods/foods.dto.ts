import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsObject, IsJSON, IsInt, Min } from 'class-validator';

export class CreateFoodDto {
  @ApiProperty({
    description: 'Ovqat nomi ko‘p tillarda',
    example: { uz: 'Pizza', ru: 'Пицца', en: 'Pizza' },
  })
  @IsJSON()
  @IsNotEmpty()
  title: { uz: string; ru: string; en: string };

  @ApiProperty({ type: 'string', format: 'binary', description: 'Ovqat rasmi (fayl)' })
//   @IsNotEmpty()
  image: any; // Swagger bilan file upload uchun
}

export class UpdateFoodDto {
  @ApiProperty({
    description: 'Ovqat nomi ko‘p tillarda',
    example: { uz: 'Pizza', ru: 'Пицца', en: 'Pizza' },
    required: false,
  })
  @IsOptional()
  @IsJSON()
  title?: { uz: string; ru: string; en: string };

  @ApiProperty({ description: 'Ovqat faolmi yoki yo‘q', example: true, required: false })
  @IsOptional()

  isActive?: boolean;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Ovqat rasmi (fayl)', required: false })
  @IsOptional()
  image?: any;
}


export class FoodSequenceDto {
  @ApiProperty({
    example: 3,
    description: 'Yangi sequence tartib raqami (1 dan boshlab)',
  })
  @IsInt({ message: 'Sequence butun son bo‘lishi kerak' })
  @Min(1, { message: 'Sequence kamida 1 bo‘lishi kerak' })
  sequence: number;
}