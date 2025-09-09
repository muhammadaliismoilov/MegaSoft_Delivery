import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from '@delivery/db/db/entities/restaurants.entity';
import { OrganizationEntity, ProductEntity, WorkDaysEntity } from '@delivery/db/db';


@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity,OrganizationEntity,WorkDaysEntity,ProductEntity])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
