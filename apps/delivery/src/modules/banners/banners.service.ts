// import { BannerEntity, BannerImageEntity, RestaurantEntity } from '@delivery/db/db';
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';


// @Injectable()
// export class BannersService {
//   constructor(
//      @InjectRepository(BannerEntity)
//         private readonly bannerRepo: Repository<BannerEntity>,
//         @InjectRepository(BannerImageEntity)
//         private readonly bannerImageRepo: Repository<BannerImageEntity>,
//         @InjectRepository(RestaurantEntity)
//         private readonly restautrantRepo: Repository<RestaurantEntity>,
//   ){}


//   async findAll(lang?: string) {
//     const banners = await this.bannerRepo.find({
//       order: { sequence: 'ASC' },
//       relations: ['images'],
//     });

//     if (lang) {
//       return banners.map(banner => ({
//         ...banner,
//         images: banner.images ? banner.images.filter(img => img.lang === lang) : []
//       }));
//     }
//     return banners;
//   }

// }


import { BannerEntity, BannerImageEntity, RestaurantEntity } from '@delivery/db/db';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { is } from 'date-fns/locale';
import { log } from 'node:console';
import { Repository } from 'typeorm';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepo: Repository<BannerEntity>,
    @InjectRepository(BannerImageEntity)
    private readonly bannerImageRepo: Repository<BannerImageEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
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
    .innerJoinAndSelect('banner.restaurant', 'restaurant')
    .leftJoinAndSelect('banner.images', 'images')
    .addSelect(distanceExpr, 'distance')
    .where('banner.isActive = :isActive', { isActive: true })
    .andWhere(`${distanceExpr} <= :radius`)
    .orderBy('distance', 'ASC')
    .setParameters({
      lat: userLat,
      lng: userLng,
      radius,
    });

  const { entities } = await qb.getRawAndEntities();

  if (!entities.length) {
    throw new NotFoundException('2000 metr radiusda restoran topilmadi');
  }

  if (lang) {
    return entities.map(banner => ({
      ...banner,
      images: banner.images ? banner.images.filter(img => img.lang === lang) : [],
    }));
  }

  return entities;
}



}
