import { makeInjectableDecorator } from '@golevelup/nestjs-common';

export const DATASOURCE_PROVIDER = Symbol('DATASOURCE_PROVIDER');
export const InjectDb = makeInjectableDecorator(DATASOURCE_PROVIDER);