import { ProductEntity } from '@delivery/db/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductResponseDto } from './product.dto';
import { AppConfig } from '../../config/app.config';



@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly config: AppConfig,
  ) {}

  async searchProducts(
    query: string,
    lang: 'uz' | 'ru' | 'en' = 'uz',
  ): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      relations: ['organizationProduct', 'prices', 'weighs', 'restaurant'],
    });

    const filtered = products.filter((p) => {
      const op = p.organizationProduct;
      const title =
        typeof op.title === 'object'
          ? op.title[lang] ?? op.title.uz ?? ''
          : op.title;
      return title.toLowerCase().includes(query.toLowerCase());
    });

    if (!filtered.length) {
      throw new NotFoundException('Qidiruv bo‘yicha mahsulot topilmadi');
    }

    return filtered.map((p) => {
      const op = p.organizationProduct;
      const title = op.title[lang] ?? op.title[this.config.mainLang]
      const description =op.description[lang] || op.description[this.config.mainLang]

      return {
        id: op.id,
        title,
        description,
        image: op.image,
        price: p.prices?.[0]?.price ?? null,
        weigh: p.weighs?.[0]?.weigh ?? null,
        restaurantId: p.restaurant.id,
        restaurantName: p.restaurant.name,
      };
    });
  }
}
