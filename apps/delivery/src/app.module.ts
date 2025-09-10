import { Module } from '@nestjs/common';

import { AppConfig } from './config/app.config';
import { ConfigifyModule } from '@itgorillaz/configify';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BannersModule } from './modules/banners/banners.module';
import { FoodTypesModule } from './modules/food_types/food_types.module';
import { RestarantsModule } from './modules/restarants/restarants.module';
import { ProductsModule } from './modules/products/products.module';

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
        BannersModule,
        FoodTypesModule,
        RestarantsModule,
        ProductsModule
         
    
    
      ],
      controllers:[],
      providers:[
        {
      provide: APP_GUARD,
      useClass: ThrottlerModule
    }
      ]
  
})
export class AppModule {}
