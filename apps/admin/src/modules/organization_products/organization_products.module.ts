import { Module } from '@nestjs/common';
import { OrganizationProductsService } from './organization_products.service';
import { OrganizationProductsController } from './organization_products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodTypesEntity, OrganizationEntity, OrganizationProductEntity, ProductEntity } from '@delivery/db/db';

@Module({
  imports:[TypeOrmModule.forFeature([OrganizationProductEntity,FoodTypesEntity,OrganizationEntity,ProductEntity])],
  controllers: [OrganizationProductsController],
  providers: [OrganizationProductsService],
})
export class OrganizationProductsModule {}
