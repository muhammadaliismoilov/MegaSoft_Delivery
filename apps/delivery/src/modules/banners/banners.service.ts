import {
  BannerEntity,
  BannerImageEntity,
  ProductEntity,
  RestaurantEntity,
} from '@delivery/db/db';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfig } from '../../config/app.config';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepo: Repository<BannerEntity>,
    @InjectRepository(BannerImageEntity)
    private readonly bannerImageRepo: Repository<BannerImageEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private config: AppConfig,
  ) {}

  async find(userLat: number, userLng: number, lang?: string) {
    try {
      const radius = 5000; // masofa (metrda)
      const distanceExpr = `
      CASE
        WHEN restaurant.id IS NOT NULL
        THEN (6371 * acos(
          cos(radians(:lat)) * cos(radians(restaurant.lat)) *
          cos(radians(restaurant.long) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(restaurant.lat))
        ))
        ELSE NULL
      END
    `;

      if (isNaN(userLat) || isNaN(userLng)) {
        throw new BadRequestException(
          'Lat va Lng to‘g‘ri son formatida bo‘lishi kerak',
        );
      }

      const query = this.bannerRepo
        .createQueryBuilder('banner')
        .leftJoin('banner.restaurant', 'restaurant')
        .leftJoin('banner.product', 'product')
        .leftJoinAndSelect(
          'banner.images',
          'images',
          '(LOWER(images.lang) = LOWER(:lang) OR LOWER(images.lang) = LOWER(:mainlang))',
          {
            lang: lang ?? this.config.mainLang,
            mainlang: this.config.mainLang,
          },
        )
        .select([
          'banner.id AS "bannerId"',
          'restaurant.id AS "restaurantId"',
          'product.id AS "productId"',
          'banner.title AS "title"',
          'banner.isActive AS "isActive"',
          'banner.startDate AS "startDate"',
          'banner.endDate AS "endDate"',
          'banner.sequence AS "sequence"',
          'banner.createdAt AS "createdAt"',
          'banner.updatedAt AS "updatedAt"',
          `${distanceExpr} AS "distance"`,
        ])
        .addSelect(['images.lang', 'images.path'])
        .where('banner.isActive = :isActive', { isActive: true })
        .where('restaurant.isOpen = :isOpen', { isOpen: true })
        .andWhere(`(${distanceExpr} <= :radius OR ${distanceExpr} IS NULL)`)
        .setParameters({
          lat: userLat,
          lng: userLng,
          radius,
        });

      const entities = await query.getRawMany();
      if (!entities || entities.length === 0) {
        throw new NotFoundException('Hech qanday banner topilmadi');
      }
      return entities;
    } catch (error) {
      console.error('Error in find method:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Bannerlarni olishda ichki server xatosi yuz berdi',
        error: error.message,
      });
    }
  }
}
