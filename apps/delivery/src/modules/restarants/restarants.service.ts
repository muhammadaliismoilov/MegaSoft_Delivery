import {
  OrganizationProductEntity,
  ProductEntity,
  RestaurantEntity,
} from '@delivery/db/db';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RestarantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restarantsRepo: Repository<RestaurantEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(OrganizationProductEntity)
    private readonly organizationProdRepo: Repository<OrganizationProductEntity>,
  ) {}
  async findAll() {
    return this.restarantsRepo.find();
  }

  async findOne(id: string) {
    return this.restarantsRepo.findOneBy({ id });
  }

  async findProducts(restaurantId: string, lang: 'uz' | 'ru' | 'en' = 'uz') {
    const products = await this.productRepo.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['organizationProduct', 'prices', 'weighs'],
    });

    return products
      .filter ((p) => p.organizationProduct)
      .map((p) => {
        const op = p.organizationProduct;
        const title =
          op.title && typeof op.title === 'object'
            ? (op.title[lang] ?? op.title.uz ?? Object.values(op.title)[0])
            : op.title;
        const description =
          op.description && typeof op.description === 'object'
            ? (op.description[lang] ??
              op.description.uz ??
              Object.values(op.description)[0])
            : op.description;

        return {
          id: op.id,
          title,
          description,
          image: op.image,
          price: p.prices?.[0]?.price ?? null,
          weigh: p.weighs?.[0]?.weigh ?? null,
        };
      });
  }
}
