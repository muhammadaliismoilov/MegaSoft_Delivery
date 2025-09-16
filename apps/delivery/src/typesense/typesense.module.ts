import { Module } from '@nestjs/common';
import { TypesenseService } from './typesens.service';


@Module({
  providers: [TypesenseService],
  exports: [TypesenseService], 
})
export class TypesenseModule {}
