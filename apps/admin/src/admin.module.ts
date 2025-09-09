import { Module } from '@nestjs/common';
import { ConfigifyModule } from '@itgorillaz/configify';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BannerModule } from './modules/banner/banner.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/products/product.module';
import { AppConfig } from './common/config/app.config';
import { FoodTypesModule } from './modules/food_types/food_types.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { WorkDaysModule } from './modules/work_days/work_days.module';
import { OrganizationModule } from './modules/organizations/organizations.module';
import { OrganizationProductsModule } from './modules/organization_products/organization_products.module';
import { PricesModule } from './modules/prices/prices.module';
import { WeighsModule } from './modules/weighs/weighs.module';

@Module({
  imports: [
 ConfigifyModule.forRootAsync(),
    TypeOrmModule.forRootAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        type: 'postgres',
        host: config.dbHost,
        port: config.dbPort,
        username: config.dbUsername,
        password: config.dbPassword,
        database: config.dbName,
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers:[
        {
          ttl:60000,
          limit: 30
        }
      ]
    }),
    FoodTypesModule,
    OrganizationModule,
    RestaurantsModule,
    BannerModule,
    OrganizationProductsModule,
    ProductModule,
    PricesModule,
    WeighsModule,
    WorkDaysModule,




  ],
  controllers:[],
  providers:[
    {
  provide: APP_GUARD,
  useClass: ThrottlerGuard
}
  ]

})
export class AdminModule {}