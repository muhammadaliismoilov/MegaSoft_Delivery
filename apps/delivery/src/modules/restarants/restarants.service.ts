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
} from '@nestjs/common';
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

  async findProducts(restaurantId: string, lang: 'uz' | 'ru' | 'en' = 'uz') {
    const products = await this.productRepo.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['organizationProduct', 'prices', 'weighs'],
    });

    return products
      .filter((p) => p.organizationProduct)
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
