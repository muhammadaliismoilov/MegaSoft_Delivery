import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class BannerImageResponseDto {
  @ApiProperty({ example: 'uz', description: 'Tasvir tili' })
  lang: string;
 
  @ApiProperty({ example: 'http://example.com/image.jpg', description: 'Tasvir URL' })
  path: string;

}

export class BannerResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'Banner ID' })
  @Expose()
  bannerId: string;

  @ApiProperty({ example: 'uuid-string-or-null', description: 'Restoran ID (ixtiyoriy)' })
  @Expose()
  restaurantId: string | null;

  @ApiProperty({ example: 'uuid-string-or-null', description: 'Mahsulot ID (ixtiyoriy)' })
  @Expose()
  productId: string | null;

  @ApiProperty({ example: 'Banner Title', description: 'Banner sarlavhasi' })
  @Expose()
  title: string;

  @ApiProperty({ example: true, description: 'Banner faol holati' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: '2025-09-12 15:30:00', description: 'Boshlanish sanasi' })
  @Expose()
  startDate: string | null;

  @ApiProperty({ example: '2025-09-15 23:59:59', description: 'Tugash sanasi' })
  @Expose()
  endDate: string | null;

  @ApiProperty({ example: 1, description: 'Tartib raqami' })
  @Expose()
  sequence: number;

  @ApiProperty({ example: '2025-09-12T11:42:55.965Z', description: 'Yaratilgan vaqt' })
  @Expose()
  createdAt: string;

  @ApiProperty({ example: '2025-09-12T11:42:55.965Z', description: 'Yangilangan vaqt' })
  @Expose()
  updatedAt: string;

  @ApiProperty({ example: 2.345, description: 'Masofa (km)', nullable: true })
  @Expose()
  distance: number | null;

  @ApiProperty({ type: [BannerImageResponseDto], description: 'Banner tasvirlari' })
  @Expose()
  images: BannerImageResponseDto[];
}