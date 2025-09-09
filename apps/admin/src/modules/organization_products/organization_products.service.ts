
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FoodTypesEntity,
  OrganizationEntity,
  OrganizationProductEntity,
  ProductEntity,
} from '@delivery/db/db';
import {
  CreateOrganizationProductDto,
  UpdateOrganizationProductDto,
} from './organuzation_products.dto';

@Injectable()
export class OrganizationProductsService {
  constructor(
    @InjectRepository(OrganizationProductEntity)
    private readonly orgProdRepository: Repository<OrganizationProductEntity>,

    @InjectRepository(FoodTypesEntity)
    private readonly foodRepository: Repository<FoodTypesEntity>,

    @InjectRepository(OrganizationEntity)
    private readonly organizationRepository: Repository<OrganizationEntity>,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // 🟢 Yangi mahsulot qo‘shish
  async create(dto: CreateOrganizationProductDto) {
    try {
      // food_id bo'lsa uni tekshiramiz
     
       const food = await this.foodRepository.findOne({
          where: { id: dto.food_type_id },
        });
        if (!food) {
          throw new BadRequestException(
            `Bunday food_id (${dto.food_type_id}) li ovqat mavjud emas`,
          );
        }


      // organization_id ni tekshiramiz
      const organization = await this.organizationRepository.findOne({
        where: { id: dto.organization_id },
      });
      if (!organization) {
        throw new BadRequestException(
          `Bunday organization_id (${dto.organization_id}) li tashkilot mavjud emas`,
        );
      }

      if (typeof dto.title === 'string') dto.title = JSON.parse(dto.title);
      if (typeof dto.description === 'string')
        dto.description = JSON.parse(dto.description);

      const product = this.orgProdRepository.create({
        ...dto,
        food_id: food,
        organization_id: organization,
      });

      return await this.orgProdRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Mahsulot qo‘shishda xato: ${error.message}`,
      );
    }
  }

  // 🔵 Barcha mahsulotlarni olish
  async findAll() {
    try {
      return await this.orgProdRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Mahsulotlarni olishda xato: ${error.message}`,
      );
    }
  }

  // 🟡 ID bo‘yicha mahsulot olish
  async findOne(id: string) {
    try {
      const product = await this.orgProdRepository.findOne({
        where: { id },
        relations: ['food_id', 'organization_id', 'products'],
      });
      if (!product) throw new NotFoundException('Mahsulot topilmadi');
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Mahsulotni olishda xato: ${error.message}`,
      );
    }
  }

  // 🟠 Yangilash
  async update(id: string, dto: UpdateOrganizationProductDto) {
    try {
      const product = await this.findOne(id);

      // JSON parse
      if (dto.title && typeof dto.title === 'string') {
        try {
          dto.title = JSON.parse(dto.title) as any;
        } catch {
          throw new BadRequestException('Title noto‘g‘ri JSON formatda');
        }
      }
      if (dto.description && typeof dto.description === 'string') {
        try {
          dto.description = JSON.parse(dto.description) as any;
        } catch {
          throw new BadRequestException('Description noto‘g‘ri JSON formatda');
        }
      }

      Object.assign(product, dto);

      if (dto.food_type_id) {
        const food = await this.foodRepository.findOne({
          where: { id: dto.food_type_id },
        });
        if (!food) throw new BadRequestException('Food type topilmadi');
        product.food_id = food;
      }

      if (dto.organization_id) {
        const org = await this.organizationRepository.findOne({
          where: { id: dto.organization_id },
        });
        if (!org) throw new BadRequestException('Organization topilmadi');
        product.organization_id = org;
      }

      return await this.orgProdRepository.save(product);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Mahsulotni yangilashda xato: ${error.message}`,
      );
    }
  }

  // 🔴 Soft delete
  async remove(id: string): Promise<{ message: string }> {
    try {
      const product = await this.findOne(id);
      await this.orgProdRepository.softRemove(product);
      return { message: 'Mahsulot soft delete qilindi (deleted_at to‘ldi)' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        `Mahsulotni o‘chirishda xato: ${error.message}`,
      );
    }
  }

  // 🔄 Restore
  async restore(id: string): Promise<{ message: string }> {
    try {
      await this.orgProdRepository.restore(id);
      return { message: 'Mahsulot qayta tiklandi' };
    } catch (error) {
      throw new InternalServerErrorException(
        `Mahsulotni tiklashda xato: ${error.message}`,
      );
    }
  }
}
