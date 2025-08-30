import { RestaurantEntity } from '@delivery/db/db/entities/restaurant.entity';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantCreateDto, RestaurantUpdateDto } from './restaurant.dto';
import fs from 'fs'

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
  ) {}

  async getAllRestaurants() {
    return this.restaurantRepo.find();
  }

  async getOneRestaurant(restaurantId: string) {
    const restaurant = await this.restaurantRepo.findOneBy({ id: restaurantId });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id: ${restaurantId} not found`);
    }
    return restaurant;
  }

  async createRestaurant(dto: RestaurantCreateDto) {
    const newRestaurant = this.restaurantRepo.create(dto);
    const saved = await this.restaurantRepo.save(newRestaurant);
    if (!saved) {
      throw new BadRequestException('Failed to create a new restaurant');
    }
    return saved;
  }

  async updateRestaurant(id: string, dto: RestaurantUpdateDto, imageUrl?: string) {
    const restaurant = await this.restaurantRepo.findOneBy({ id });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (imageUrl) {
      if (restaurant.imageUrl) {
        try {
          fs.unlinkSync(`.${restaurant.imageUrl}`);
        } catch (err) {
          console.warn('Old image not found:', err.message);
        }
      }
      restaurant.imageUrl = imageUrl;
    }

    Object.assign(restaurant, dto);
    return this.restaurantRepo.save(restaurant);
  }

  async deleteRestaurant(restaurantId: string) {
    const restaurant = await this.restaurantRepo.findOneBy({ id: restaurantId });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.imageUrl) {
      try {
        fs.unlinkSync(`.${restaurant.imageUrl}`);
      } catch (err) {
        console.warn('Could not delete image:', err.message);
      }
    }

    await this.restaurantRepo.delete(restaurantId);
    return { message: `Restaurant with id:${restaurantId} deleted successfully!` };
  }
}

