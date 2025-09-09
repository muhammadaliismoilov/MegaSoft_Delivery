import { RestaurantEntity } from '@delivery/db/db/entities/restaurants.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RestaurantCreateDto, RestaurantUpdateDto } from './restaurant.dto';
import * as fs from 'fs';
import * as path from 'path';
import { OrganizationEntity, WorkDaysEntity } from '@delivery/db/db';
import { id } from 'date-fns/locale';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly organizationRepo: Repository<OrganizationEntity>,
    @InjectRepository(WorkDaysEntity)
    private readonly workDayRepo: Repository<WorkDaysEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getAll() {
    return await this.restaurantRepo.find();
  }

  async getOne(restaurantId: string) {
    const restaurant = await this.restaurantRepo.find({where:{id:restaurantId}});
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id: ${restaurantId} not found`,
      );
    }
    return restaurant;
  }

  // async createRestaurant(dto: RestaurantCreateDto) {
  //   try {
  //     const organization = await this.organizationRepo.findOneBy({
  //       id: dto.organizationId,
  //     });
  //     if (!organization) {
  //       throw new NotFoundException('Tashkilot topilmadi');
  //     }

  //     // Agar DTO’da image bo‘lsa, relative path sifatida saqlaymiz
  //     if (dto.image && dto.image.startsWith('/')) {
  //       dto.image = dto.image.substring(1); // masalan: /uploads/x.png → uploads/x.png
  //     }
  //     console.log(dto);

  //     const newRestaurant = this.restaurantRepo.create(
  //       dto,

  //     );
  //     return await this.restaurantRepo.save(newRestaurant);
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       `Restoran yaratishda xatolik yuz berdi: ${error.message}`,
  //     );
  //   }
  // }
  async create(dto: RestaurantCreateDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        // 1. Tashkilotni tekshiramiz
        const organization = await manager.findOne(OrganizationEntity, {
          where: { id: dto.organizationId },
        });
        if (!organization) {
          throw new NotFoundException('Tashkilot topilmadi');
        }

        // 2. Image path ni tozalash
        if (dto.image && dto.image.startsWith('/')) {
          dto.image = dto.image.substring(1);
        }

        // 3. Restoranni yaratamiz
        const { dayOfWeek, openTime, closeTime, isOpen, ...rest } = dto;
        const newRestaurant = manager.create(RestaurantEntity, {
          ...rest,
          organization,
        });
        const savedRestaurant = await manager.save(
          RestaurantEntity,
          newRestaurant,
        );

        if (!savedRestaurant) {
          throw new BadRequestException('Restoran yaratib bo‘lmadi');
        }

        // 4. Workdays saqlash
        if (Array.isArray(dayOfWeek) && dayOfWeek.length > 0) {
          const workdayEntities = dayOfWeek.map((day) =>
            manager.create(WorkDaysEntity, {
              restaurant: { id: savedRestaurant.id }, //savedRestaurant.id,
              dayOfWeek: day,
              openTime: openTime ?? '09:00', // default agar berilmasa
              closeTime: closeTime ?? '18:00',
              isClosed: !isOpen, // isOpen false bo‘lsa → isClosed true
            }),
          );
          await manager.save(WorkDaysEntity, workdayEntities);
        }

        // 5. Restoran + relationlar bilan qaytaramiz
        return manager.findOne(RestaurantEntity, {
          where: { id: savedRestaurant.id },
          relations: ['organization', 'workdays'],
        });
      });
    } catch (error) {
      console.error('createRestaurant error:', error);
      throw new InternalServerErrorException(
        `Restoran yaratishda xatolik yuz berdi: ${error.message}`,
      );
    }
  }

  async update(id: string, dto: RestaurantUpdateDto, image?: string) {
    const restaurant = await this.restaurantRepo.findOneBy({ id });
    if (!restaurant) {
      throw new NotFoundException('Restaurant topilmadi');
    }

    // Eski rasmni o‘chirish
    if (image) {
      if (restaurant.image) {
        try {
          const oldPath = path.join(process.cwd(), restaurant.image);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        } catch (err) {
          console.warn('Eski rasmni o‘chirishda xato:', err.message);
        }
      }

      // Yangi rasm pathini relative qilib saqlash
      restaurant.image = image.startsWith('/') ? image.substring(1) : image;
    }

    // DTO dan faqat qiymati bor (null/undefined emas) fieldlarni olish
    Object.keys(dto).forEach((key) => {
      const value = dto[key];
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 0
      ) {
        restaurant[key] = value;
      }
    });

    return this.restaurantRepo.save(restaurant);
  }

  async delete(restaurantId: string) {
    const restaurant = await this.restaurantRepo.findOneBy({
      id: restaurantId,
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.image) {
      try {
        const imgPath = path.join(process.cwd(), restaurant.image);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      } catch (err) {
        console.warn('Could not delete image:', err.message);
      }
    }

    await this.restaurantRepo.delete(restaurantId);
    return {
      message: `Restaurant with id:${restaurantId} deleted successfully!`,
    };
  }
}
