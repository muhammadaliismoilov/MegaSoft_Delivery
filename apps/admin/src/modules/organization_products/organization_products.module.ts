import { Module } from '@nestjs/common';
import { OrganizationProductsService } from './organization_products.service';
import { OrganizationProductsController } from './organization_products.controller';

@Module({
  controllers: [OrganizationProductsController],
  providers: [OrganizationProductsService],
})
export class OrganizationProductsModule {}
