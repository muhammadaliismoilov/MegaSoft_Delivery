import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationProductEntity, PriceEntity, ProductEntity, RestaurantEntity, WeighEntity } from 'libs/db/src';
import { TypesenseModule } from 'apps/delivery/src/typesense/typesense.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, PriceEntity, WeighEntity, RestaurantEntity,OrganizationProductEntity]),TypesenseModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
