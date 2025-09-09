import { RestaurantEntity } from '@delivery/db/db';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class RestarantsService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restarantsRepo: Repository<RestaurantEntity>,
  ){} 

  



}
