import type { DataSource } from '@delivery/db/db';
import { InjectDb } from '@delivery/db/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @InjectDb()
    private readonly db: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
