import { Expose } from 'class-transformer';

export class ProductResponseDto {
  id: string;
  @Expose({ name: 'title', toPlainOnly: true })
  title: string;
  @Expose({ name: 'description', toPlainOnly: true })
  description: string;
  @Expose({ name: 'image', toPlainOnly: true })
  image: string;
  @Expose({ name: 'price', toPlainOnly: true })
  price: number | null;
  @Expose({ name: 'weigh', toPlainOnly: true })
  weigh: number | null;
  @Expose({ name: 'restaurantId', toPlainOnly: true })
  restaurantId: string;
  @Expose({ name: 'restaurantName', toPlainOnly: true })
  restaurantName: string;
}
