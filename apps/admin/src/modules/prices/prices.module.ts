import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';
import { PriceEntity, ProductEntity } from '@delivery/db/db';

@Module({
  imports: [TypeOrmModule.forFeature([PriceEntity, ProductEntity])],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
