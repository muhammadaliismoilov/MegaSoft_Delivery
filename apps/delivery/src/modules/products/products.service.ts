import { ProductEntity } from '@delivery/db/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductResponseDto } from './product.dto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
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
      const title =
        typeof op.title === 'object'
          ? op.title[lang] ?? op.title.uz ?? Object.values(op.title)[0]
          : op.title;
      const description =
        typeof op.description === 'object'
          ? op.description[lang] ??
            op.description.uz ??
            Object.values(op.description)[0]
          : op.description;

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
