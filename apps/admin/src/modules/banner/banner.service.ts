import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  BannerCreateDTO,
  BannerUpdateDTO,
  BannerSequenceDto,
} from './banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { BannerEntity, BannerImageEntity, FoodTypesEntity, ProductEntity, RestaurantEntity } from 'libs/db/src';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepo: Repository<BannerEntity>,
    @InjectRepository(BannerImageEntity)
    private readonly bannerImageRepo: Repository<BannerImageEntity>,
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
    @InjectRepository(FoodTypesEntity)
    private readonly foodTypeRepo: Repository<FoodTypesEntity>,
     @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
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
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Internal server error',
    
      );
    }
  }



  async create(dto: BannerCreateDTO) {
  try {

    const foodType = await this.foodTypeRepo.findOneBy({ id: dto.foodTypeId });
    if (!foodType) throw new NotFoundException('Oziq-ovqat turi topilmadi');

    let restaurant: RestaurantEntity | null = null;
    if (dto.restaurantId) {
      restaurant = await this.restaurantRepo.findOneBy({ id: dto.restaurantId });
      if (!restaurant) throw new NotFoundException('Restauran topilmadi');
    }

    let product: ProductEntity | null = null;
    if (dto.productId) {
      product = await this.productRepo.findOneBy({ id: dto.productId });
      if (!product) throw new NotFoundException('Mahsulot topilmadi');
    }

    const maxSeq = await this.bannerRepo
      .createQueryBuilder('banner')
      .select('MAX(banner.sequence)', 'max')
      .getRawOne<{ max: number }>();
    const sequence = (maxSeq?.max || 0) + 1;

    const startDate = dto.startDate ? dto.startDate.toISOString().split('T')[0] : null;
    const endDate = dto.endDate ? dto.endDate.toISOString().split('T')[0] : null;

    const isActive = dto.isActive ?? true;
    const currentDate = new Date().toISOString().split('T')[0];
    const finalIsActive = endDate && endDate < currentDate ? false : isActive;

    const banner = this.bannerRepo.create({
      title: dto.title,
      isActive: finalIsActive,
      restaurant,
      foodType,
      product,
      sequence,
      startDate,
      endDate,
    } as Partial<BannerEntity>);

    return this.bannerRepo.save(banner);
  } catch (error) {
    console.error(error);
     if (error instanceof NotFoundException) throw error;
    throw new InternalServerErrorException('Ichki server xatosi');
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
       if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Internal server error',
        
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
       if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Internal server error',
    
      );
    }
  }

  // Upload or update banner images per language
  // async uploadOrUpdate(
  //   bannerId: string,
  //   images: {
  //     uz?: Express.Multer.File | null;
  //     ru?: Express.Multer.File | null;
  //     en?: Express.Multer.File | null;
  //   },
  // ) {
  //   try {
  //     const banner = await this.bannerRepo.findOneBy({ id: bannerId });
  //     if (!banner) throw new NotFoundException('Banner not found');

  //     for (const [lang, file] of Object.entries(images)) {
  //       if (!file?.filename) continue;

  //       let bannerImage = await this.bannerImageRepo.findOne({
  //         where: { banner: { id: bannerId }, lang },
  //       });

  //       if (bannerImage) {
  //         bannerImage.path = file.filename;
  //       } else {
  //         bannerImage = this.bannerImageRepo.create({
  //           banner,
  //           lang,
  //           path: file.filename,
  //         });
  //       }

  //       return this.bannerImageRepo.save(bannerImage);
  //     }

  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException(
  //       'Internal server error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // Update banner sequence with reordering

  async uploadOrUpdate(
    bannerId: string,
    images: {
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

        const saved = await this.bannerImageRepo.save(bannerImage);
      }

      return {
        message: 'Rasm yuklanidi yoki yangilandi' 
      };
      // barcha natijalarni qaytaramiz
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

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
