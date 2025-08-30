import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class TranslatableDto {
  @ApiProperty({ example: 'Salatlar', description: 'Kategoriya nomi (uz)' })
  @IsOptional()
  @IsString({ message: 'uz matn bo‘lishi kerak' })
  uz: string;

  @ApiProperty({ example: 'Салаты', description: 'Kategoriya nomi (ru)' })
  @IsOptional()
  @IsString({ message: 'ru matn bo‘lishi kerak' })
  ru?: string | null;

  @ApiProperty({ example: 'Salads', description: 'Kategoriya nomi (en)' })
  @IsOptional()
  @IsString({ message: 'en matn bo‘lishi kerak' })
  en?: string | null;
}