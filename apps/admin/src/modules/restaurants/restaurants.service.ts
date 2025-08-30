import { RestaurantEntity } from '@delivery/db/db/entities/restaurant.entity';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantCreateDto, RestaurantUpdateDto } from './restaurant.dto';

@Injectable()
export class RestaurantsService {
    constructor(@InjectRepository(RestaurantEntity) private readonly restaurantRepo: Repository<RestaurantEntity>) { }

    async getAllRestaurants() {
        try {
            const restaurants = await this.restaurantRepo.find();
            return restaurants
        } catch (error) {
            console.error(error)
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getOneRestaurant(restaurantId: string) {
        try {
            const restaurant = await this.restaurantRepo.findOne({ where: { id: restaurantId } })
            if (!restaurant) {
                throw new NotFoundException(`Restaurant with id: ${restaurantId} not found`)
            }
            return restaurant;
        } catch (error) {
            console.error(error)
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async createRestaurant(dto: RestaurantCreateDto) {
        try {

            const newProduct = this.restaurantRepo.create(dto);
            const savedProduct = await this.restaurantRepo.save(newProduct);

            if (!savedProduct) {
                throw new BadRequestException('Failed to create a new restaurant');
            }

        } catch (error) {
            console.error(error)
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async updateRestaurant(restaurantId: string, dto:RestaurantUpdateDto) {
        try {

            const restaurant = await this.restaurantRepo.findOneBy({id: restaurantId})
            if(!restaurant) throw new NotFoundException('Restaurant not found')

            Object.assign(restaurant, dto, {updatedAt: new Date()})
            return this.restaurantRepo.save(restaurant)
        } catch (error) {
            console.error(error)
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteRestaurant(restaurantId: string) {
        try {

            const restaurant = await this.restaurantRepo.findOneBy({id: restaurantId})
            if(!restaurant) throw new NotFoundException('Restaurant not found')

            await this.restaurantRepo.delete(restaurantId)
            return this.restaurantRepo.save(restaurant)
        } catch (error) {
            console.error(error)
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
