import {
  OrganizationProductEntity,
  ProductEntity,
  RestaurantEntity,
} from '@delivery/db/db';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfig } from '../../config/app.config';

@Injectable()
export class RestarantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restarantsRepo: Repository<RestaurantEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectRepository(OrganizationProductEntity)
    private readonly organizationProdRepo: Repository<OrganizationProductEntity>,
    private readonly mainLang: AppConfig
  ) {}
  async findAll(userLat: number, userLng: number) {
    try {
      const radius = 2000; //metr
      const distance = `(6371 * acos(
      cos(radians(:lat)) * cos(radians(restaurants.lat)) *
      cos(radians(restaurants.long) - radians(:lng)) +
      sin(radians(:lat)) * sin(radians(restaurants.lat))
    ))`;

      if (isNaN(userLat) || isNaN(userLng)) {
        throw new BadRequestException(
          'Lat va Lng to‘g‘ri son formatida bo‘lishi kerak',
        );
      }

      const restaurants = await this.restarantsRepo
        .createQueryBuilder('restaurants')
        .select([
          'restaurants.id AS id',
          'restaurants.name AS name',
          'restaurants.description AS description',
          'restaurants.address AS address',
          'restaurants.image AS image',
          'restaurants.lat AS lat',
          'restaurants.long AS long',
          'restaurants.freeDelivery AS freeDelivery',
          'restaurants.isOpen AS isOpen',
          'restaurants.created_at AS createdAt',
          'restaurants.updated_at AS updatedAt',
        ])
        .addSelect(distance, 'distance')
        .where(`${distance} <= :radius`, {
          lat: userLat,
          lng: userLng,
          radius,
        })
        .where('restaurants.isOpen = :isOpen', { isOpen: true })
        .orderBy('distance', 'ASC')
        .getRawMany();

      return restaurants;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Restaranlarni olishda serverda xatolik yuz berdi',
        error.message,
      );
    }
  }

  async findOne(id: string) {
    try {
      return this.restarantsRepo.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(
        'Restaranlarni olishda serverda xatolik yuz berdi ',
        error.message,
      );
    }
  }


async findProducts(
  restaurantId: string,
  title?: string,
  lang?: 'uz' | 'ru' | 'en',
) {
  // lang berilmasa asosiy tilni ishlatamiz
  const searchLang = lang || this.mainLang;

  const qb = this.productRepo
    .createQueryBuilder('product')
    .leftJoin('product.organizationProduct', 'organizationProduct')
    .leftJoin('product.prices', 'prices')
    .leftJoin('product.weighs', 'weighs')
    .leftJoin('product.restaurant', 'restaurant')
    .where('restaurant.id = :restaurantId', { restaurantId })
    .andWhere('product.deleted_at IS NULL')
    .andWhere('organizationProduct.deleted_at IS NULL')
    .select([
      'product.id AS product_id',
      'product.isAvailable AS product_isAvailable',
      'organizationProduct.id AS orgProduct_id',
      `organizationProduct.title ->> :lang AS orgProduct_title`,
      `organizationProduct.description ->> :lang AS orgProduct_description`,
      'organizationProduct.image AS orgProduct_image',
      'prices.current_price AS price',
      'weighs.weigh AS weigh',
      
    ])
    .setParameter('lang', searchLang);

  if (title) {
    qb.andWhere(
      `LOWER(organizationProduct.title ->> :lang) LIKE LOWER(:title)`,
      { lang: searchLang, title: `%${title}%` },
    );
  }

  const rawProducts = await qb.getRawMany();
 
  
  if (!rawProducts) {
    throw new NotFoundException(
      'Mahsulotlar topilmadi yoki restoran mavjud emas',
    );
  }

  return rawProducts
}

}
