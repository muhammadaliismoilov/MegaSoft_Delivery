import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestarantsService } from './restarants.service';


@Controller('restarants')
export class RestarantsController {
  constructor(private readonly restarantsService: RestarantsService) {}


}
