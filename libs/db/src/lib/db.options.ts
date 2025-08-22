import { ModuleMetadata, Type } from '@nestjs/common';

export interface DeliveryDbOptions {
  connectionString: string;
  global?: boolean;
}

export const DELIVERY_DB_OPTIONS_PROVIDER = Symbol(
  'DELIVERY_DB_OPTIONS_PROVIDER',
);

export interface DeliveryDbModuleFactory {
  createHttpModuleOptions: () => Promise<DeliveryDbOptions> | DeliveryDbOptions;
}

export interface DeliveryDbAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  global: boolean;
  useClass?: Type<DeliveryDbModuleFactory>;
  useExisting?: Type<DeliveryDbModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<DeliveryDbOptions> | DeliveryDbOptions;
}
