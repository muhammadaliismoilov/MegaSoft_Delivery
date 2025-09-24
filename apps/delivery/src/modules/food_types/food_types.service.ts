import { FoodTypesEntity } from '@delivery/db/db';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class FoodTypesService {
  constructor(
    @InjectRepository(FoodTypesEntity)
    private readonly foodTypesRepo: Repository<FoodTypesEntity>,
  ){}

  async 


  async findAll() {
    return this.foodTypesRepo.find();
  }

  async findOne(id: string) {
    return this.foodTypesRepo.findOne({where:{id}, relations : ['organizationProduct']});
  }
}
