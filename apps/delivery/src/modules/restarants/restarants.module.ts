import { Module } from '@nestjs/common';
import { RestarantsService } from './restarants.service';
import { RestarantsController } from './restarants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodTypesEntity, OrganizationProductEntity, ProductEntity, RestaurantEntity } from '@delivery/db/db';

@Module({
  imports:[TypeOrmModule.forFeature([RestaurantEntity,FoodTypesEntity,ProductEntity,OrganizationProductEntity])],
  controllers: [RestarantsController],
  providers: [RestarantsService],
})
export class RestarantsModule {}
