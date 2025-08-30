import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceEntity, ProductEntity, WeighEntity } from 'libs/db/src';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, PriceEntity, WeighEntity])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
