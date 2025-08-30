import { Injectable } from '@nestjs/common';
import { LogCreateDto } from './log.dto';
import { DataSource } from 'typeorm';
import { InjectDb } from 'libs/providers/db.provider';

@Injectable()
export class LogService {
  constructor(@InjectDb() private readonly db: DataSource) {}

  async create(dto: LogCreateDto) {
   
   
  }
}
