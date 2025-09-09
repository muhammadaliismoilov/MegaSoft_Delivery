import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber, IsPositive } from 'class-validator';

export class CreateWeighDto {
  @ApiProperty({
    example: 'a3e2c3d4-5678-90ab-cdef-1234567890ab',
    description: 'Mahsulotning UUID',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 1.5,
    description: 'Mahsulot og‘irligi (kg, litr va h.k.)',
  })
  @IsNumber()
  @IsPositive()
  weigh: number;
}



export class UpdateWeighDto extends PartialType(CreateWeighDto) {}
