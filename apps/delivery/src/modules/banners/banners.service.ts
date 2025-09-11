import {
  BannerEntity,
  BannerImageEntity,
  RestaurantEntity,
} from '@delivery/db/db';
import { Injectable, NotFoundException } from '@nestjs/common';
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
    private config: AppConfig,
  ) {}
  async find(userLat: number, userLng: number, lang?: string) {
    const radius = 5; // km

    const distanceExpr = `
    (6371 * acos(
      cos(radians(:lat)) * cos(radians(restaurant.lat)) *
      cos(radians(restaurant.long) - radians(:lng)) +
      sin(radians(:lat)) * sin(radians(restaurant.lat))
    ))
  `;

    const qb = this.bannerRepo
      .createQueryBuilder('banner')
      .innerJoin('banner.restaurant', 'restaurant')
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
        'banner.title AS "title"',
        'banner.isActive AS "isActive"',
        'banner.startDate AS "startDate"',
        'banner.endDate AS "endDate"',
        'banner.sequence AS "sequence"',
        'banner.createdAt AS "createdAt"',
        'banner.updatedAt AS "updatedAt"',
        'images.id AS "imageId"',
        'images.lang AS "lang"',
        'images.path AS "path"',
        `${distanceExpr} AS "distance"`,
      ])
      .where('banner.isActive = :isActive', { isActive: true })
      .andWhere(`${distanceExpr} <= :radius`)
      .orderBy('distance', 'ASC')
      .setParameters({
        lat: userLat,
        lng: userLng,
        radius,
      });

    const entities = await qb.getRawMany();

    console.log('sasdff', entities);

    if (!entities.length) {
      throw new NotFoundException('2000 metr radiusda restoran topilmadi');
    }

    return entities;
  }
}
