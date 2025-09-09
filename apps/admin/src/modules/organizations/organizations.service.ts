import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organizations.dto';
import { OrganizationEntity } from '@delivery/db/db';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly orgRepository: Repository<OrganizationEntity>,
  ) {}

  // 🟢 Yangi tashkilot qo‘shish
  async create(dto: CreateOrganizationDto) {
    try {
      // title JSON validatsiya
      let dtoTitle: { uz: string; ru: string; en: string };
      try {
        dtoTitle =
          typeof dto.title === 'string' ? JSON.parse(dto.title) : dto.title;
      } catch (e) {
        throw new BadRequestException('title noto‘g‘ri JSON formatda');
      }

      if (!dtoTitle?.uz || !dtoTitle?.ru || !dtoTitle?.en) {
        throw new BadRequestException(
          'title da barcha tillar (uz, ru, en) bo‘lishi shart',
        );
      }

      // 🔎 noyoblikni tekshirish
      const existingOrg = await this.orgRepository
        .createQueryBuilder('org')
        .where("org.title->>'uz' = :uz", { uz: dtoTitle.uz.trim() })
        .orWhere("org.title->>'ru' = :ru", { ru: dtoTitle.ru.trim() })
        .orWhere("org.title->>'en' = :en", { en: dtoTitle.en.trim() })
        .getOne();

      if (existingOrg) {
        throw new ConflictException(
          'Tashkilot nomi har bir til bo‘yicha noyob bo‘lishi kerak',
        );
      }

      // 🏗 create entity
      const org = this.orgRepository.create({
        ...dto,
        title: dtoTitle,
      });

      return await this.orgRepository.save(org);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof ConflictException) throw error;

      throw new InternalServerErrorException(
        `Tashkilot qo‘shishda xato: ${error.message}`,
      );
    }
  }

  // 🔵 Barcha tashkilotlarni olish
  async findAll() {
    try {
      return await this.orgRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Tashkilotlarni olishda xato: ${error.message}`,
      );
    }
  }

  // 🟡 ID bo‘yicha bitta tashkilotni olish
  async findOne(id: string) {
    try {
      const org = await this.orgRepository.findOne({
        where: { id },
        relations: ['restaurants'],
      });
      if (!org) throw new NotFoundException('Tashkilot topilmadi');
      return org;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Bitta tashkilotni olishda xato: ${error.message}`,
      );
    }
  }

  // 🟠 Yangilash
  async update(id: string, dto: UpdateOrganizationDto) {
    try {
      const org = await this.findOne(id);

      if (dto.title !== undefined && dto.title !== null) {
        let dtoTitle: { uz: string; ru: string; en: string };
        try {
          dtoTitle =
            typeof dto.title === 'string' ? JSON.parse(dto.title) : dto.title;
        } catch (e) {
          throw new BadRequestException('title noto‘g‘ri JSON formatda');
        }

        if (!dtoTitle?.uz || !dtoTitle?.ru || !dtoTitle?.en) {
          throw new BadRequestException(
            'title da barcha tillar (uz, ru, en) bo‘lishi shart',
          );
        }

        const existingOrg = await this.orgRepository
          .createQueryBuilder('org')
          .where("org.title->>'uz' = :uz", { uz: dtoTitle.uz.trim() })
          .orWhere("org.title->>'ru' = :ru", { ru: dtoTitle.ru.trim() })
          .orWhere("org.title->>'en' = :en", { en: dtoTitle.en.trim() })
          .andWhere('org.id != :id', { id })
          .getOne();

        if (existingOrg) {
          throw new ConflictException(
            'Tashkilot nomi har bir til bo‘yicha noyob bo‘lishi kerak',
          );
        }

        org.title = dtoTitle;
      }

      if (dto.image !== undefined && dto.image !== null) {
        org.image = dto.image;
      }

      return await this.orgRepository.save(org);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof ConflictException) throw error;

      throw new InternalServerErrorException(
        `Tashkilotni yangilashda xato: ${error.message}`,
      );
    }
  }

  // 🔴 O‘chirish
  async remove(id: string): Promise<{ message: string }> {
    try {
      const org = await this.findOne(id);
      await this.orgRepository.remove(org);
      return { message: 'Tashkilot muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Tashkilotni o‘chirishda xato: ${error.message}`,
      );
    }
  }
}
