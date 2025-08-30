import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  BannerCreateDTO,
  BannerUpdateDTO,
  BannerSequenceDto,
} from './banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity, BannerImageEntity } from 'libs/db/src';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepo: Repository<BannerEntity>,
    @InjectRepository(BannerImageEntity)
    private readonly bannerImageRepo: Repository<BannerImageEntity>,
  ) {}

  // Get all banners ordered by sequence, with images grouped by language
  async get() {
    try {
      const banners = await this.bannerRepo.find({
        order: { sequence: 'ASC' },
        relations: ['images'],
      });

      return banners.map((b) => ({
        ...b,
        images: b.images?.reduce(
          (acc, img) => ({ ...acc, [img.lang]: img.path }),
          {} as Record<string, string>,
        ),
      }));
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get one banner by id
  async getOne(bannerId: string) {
    try {
      const banner = await this.bannerRepo.findOne({
        where: { id: bannerId },
        relations: ['images'],
      });

      if (!banner) throw new NotFoundException('Banner not found');

      const imagesObj = banner.images?.reduce(
        (acc, img) => {
          acc[img.lang] = img.path;
          return acc;
        },
        {} as Record<string, string>,
      );

      return { ...banner, images: imagesObj };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Create a new banner with auto-incremented sequence
  async create(dto: BannerCreateDTO) {
    try {
      const maxSeq = await this.bannerRepo
        .createQueryBuilder('banner')
        .select('MAX(banner.sequence)', 'max')
        .getRawOne<{ max: number }>();
  
      const sequence = (maxSeq?.max || 0) + 1;
  
      // Convert dates to string or undefined
      const startDate = dto.startDate ? dto.startDate.toISOString().split('T')[0] : null;
      const endDate = dto.endDate ? dto.endDate.toISOString().split('T')[0] : null;
  
      const banner = this.bannerRepo.create({
        title: dto.title,
        isActive: dto.isActive ?? true,
        sequence,
        startDate,
        endDate,
      });
  
      return this.bannerRepo.save(banner);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  // Update a banner
  async update(bannerId: string, dto: BannerUpdateDTO) {
    try {
      const banner = await this.bannerRepo.findOneBy({ id: bannerId });
      if (!banner) throw new NotFoundException('Banner not found');

      Object.assign(banner, dto, { updatedAt: new Date() });

      return this.bannerRepo.save(banner);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a banner and shift sequences
  async delete(bannerId: string) {
    try {
      const banner = await this.bannerRepo.findOneBy({ id: bannerId });
      if (!banner) throw new NotFoundException('Banner not found');

      await this.bannerRepo.delete(bannerId);

      // Shift remaining banners
      await this.bannerRepo
        .createQueryBuilder()
        .update(BannerEntity)
        .set({ sequence: () => `"sequence" - 1` })
        .where('"sequence" > :seq', { seq: banner.sequence })
        .execute();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Upload or update banner images per language
  async uploadOrUpdate(
    bannerId: string,
    images: {
      oz: Express.Multer.File | null;
      uz?: Express.Multer.File | null;
      ru?: Express.Multer.File | null;
      en?: Express.Multer.File | null;
    },
  ) {
    try {
      const banner = await this.bannerRepo.findOneBy({ id: bannerId });
      if (!banner) throw new NotFoundException('Banner not found');

      for (const [lang, file] of Object.entries(images)) {
        if (!file?.filename) continue;

        let bannerImage = await this.bannerImageRepo.findOne({
          where: { banner: { id: bannerId }, lang },
        });

        if (bannerImage) {
          bannerImage.path = file.filename;
        } else {
          bannerImage = this.bannerImageRepo.create({
            banner,
            lang,
            path: file.filename,
          });
        }

        await this.bannerImageRepo.save(bannerImage);
      }
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update banner sequence with reordering
  async updateSequence(bannerId: string, dto: BannerSequenceDto) {
    try {
      const banner = await this.bannerRepo.findOneBy({ id: bannerId });
      if (!banner) throw new NotFoundException('Banner not found');

      const currentSeq = banner.sequence;
      const newSeq = dto.sequence;

      if (currentSeq === newSeq) return;

      if (currentSeq < newSeq) {
        // Shift down banners in between
        await this.bannerRepo
          .createQueryBuilder()
          .update(BannerEntity)
          .set({ sequence: () => `"sequence" - 1` })
          .where('"sequence" > :current AND "sequence" <= :newSeq', {
            current: currentSeq,
            newSeq,
          })
          .execute();
      } else {
        // Shift up banners in between
        await this.bannerRepo
          .createQueryBuilder()
          .update(BannerEntity)
          .set({ sequence: () => `"sequence" + 1` })
          .where('"sequence" >= :newSeq AND "sequence" < :current', {
            current: currentSeq,
            newSeq,
          })
          .execute();
      }

      banner.sequence = newSeq;
      await this.bannerRepo.save(banner);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
