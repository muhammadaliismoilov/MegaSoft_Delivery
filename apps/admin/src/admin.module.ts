import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ConfigifyModule } from '@itgorillaz/configify';
import { DeliveryDbModule } from '@delivery/db/db';
import { AppConfig } from '../../delivery/src/config/app.config';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    DeliveryDbModule.forRootAsync({
      inject: [AppConfig],
      global: true,
      useFactory: (config: AppConfig) => {
        return {
          connectionString: config.databaseUrl,
        };
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
