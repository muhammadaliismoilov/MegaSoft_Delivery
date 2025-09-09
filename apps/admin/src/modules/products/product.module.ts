import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationProductEntity, PriceEntity, ProductEntity, RestaurantEntity, WeighEntity } from 'libs/db/src';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, PriceEntity, WeighEntity, RestaurantEntity,OrganizationProductEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
