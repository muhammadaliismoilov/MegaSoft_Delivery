import {
    ClassSerializerInterceptor,
    Controller,
    Injectable,
    Post,
    UseInterceptors,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
  import * as  db_1  from 'libs/db/src';
  import { banners } from 'libs/db/src';
  import { sql } from 'drizzle-orm';
  
  @ApiTags('seeder')
  @UseInterceptors(ClassSerializerInterceptor)
  @Controller('seeder')
  @Injectable()
  @ApiBearerAuth('access-token')
  export class SeederController {
    constructor(
      @db_1.InjectDb()
      private readonly db: db_1.DataSource,
    ) {}
  
    @Post()
    @ApiOperation({ summary: 'Seed initial banners' })
    async seeder() {
      await this.seedBanners();
      return { message: 'Seeder completed successfully' };
    }
  
    // Generate URL-friendly slug
    private slug(text: string) {
      return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');
    }
  
    // Seed banners
    private async seedBanners() {
      const bannerList = [
        { title: 'Serial', sequence: 1 },
        { title: 'Film', sequence: 2 },
        { title: 'Multfilm', sequence: 3 },
        { title: 'Primyera', sequence: 4 },
        { title: 'Xorijiy filmlar', sequence: 5 },
        { title: 'O‘zbek filmlar', sequence: 6 },
        { title: 'Turk filmlar', sequence: 7 },
      ];
  
      for (const banner of bannerList) {
        const slugValue = this.slug(banner.title);
  
        await this.db
          .insert(banners)
          .values({
            title: banner.title,
            sequence: banner.sequence,
            isActive: true,
            // Optional: you can add startDate/endDate here
            // slug: slugValue, // make sure to add slug column to your schema first
          })
          .onConflictDoUpdate({
            target: [banners.title], // or slug if you add slug column
            set: {
              sequence: sql`${banner.sequence}`,
              isActive: sql`TRUE`,
              updatedAt: new Date(),
            },
          })
          .execute();
      }
    }
  }
  