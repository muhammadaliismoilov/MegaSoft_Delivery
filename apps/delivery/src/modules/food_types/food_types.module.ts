import { Module } from '@nestjs/common';
import { FoodTypesService } from './food_types.service';
import { FoodTypesController } from './food_types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodTypesEntity } from '@delivery/db/db';

@Module({
  imports:[TypeOrmModule.forFeature([FoodTypesEntity])],
  controllers: [FoodTypesController],
  providers: [FoodTypesService],
})
export class FoodTypesModule {}
