import { ApiProperty } from '@nestjs/swagger';

export class RestaurantResponseDto {
  @ApiProperty({ example: 'ca4678c6-b310-4622-b215-2e8846b9262e' })
  id: string;

  @ApiProperty({ example: 'Qamish Gamburg' })
  name: string;

  @ApiProperty({ example: 'Oilaviy restoran, pitsa va burgerlar' })
  description: string;

  @ApiProperty({ example: 'Urganch sh, Qirgiz yap' })
  address: string;

  @ApiProperty({ example: 'uploads/1757332848018-826654396.jpeg' })
  image: string;

  @ApiProperty({ example: 41.549861 })
  lat: number;

  @ApiProperty({ example: 60.604236 })
  long: number;

  @ApiProperty({ example: false })
  freeDelivery: boolean;

  @ApiProperty({ example: true })
  isOpen: boolean;

  @ApiProperty({ example: '2025-09-08T12:00:48.030Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-09-12T11:00:58.999Z' })
  updatedAt: Date;

  @ApiProperty({ example: 0.17959314578960953, description: 'Foydalanuvchi joylashuvigacha bo‘lgan masofa (km)' })
  distance: number;
}
