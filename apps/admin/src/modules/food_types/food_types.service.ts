import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CreateFoodTypeDto, FoodTypeSequenceDto, UpdateFoodTypeDto } from './food_types.dto';
import { FoodTypesEntity } from '@delivery/db/db';


@Injectable()
export class FoodTypeService {
  constructor(
    @InjectRepository(FoodTypesEntity)
    private readonly foodTypeRepository: Repository<FoodTypesEntity>,
  ) {}

  // Yangi ovqat qo'shish
  async create(dto: CreateFoodTypeDto) {
    try {
      // 1. DTO.title ni JSON qilib parse qilish
      let dtoTitle: { uz: string; ru: string; en: string };
      try {
        dtoTitle =
          typeof dto.title === 'string' ? JSON.parse(dto.title) : dto.title;
      } catch (e) {
        throw new BadRequestException(
          'DTO.title JSON emas yoki noto‘g‘ri formatda',
        );
      }

      // 2. Har bir til bo‘yicha tekshirish
      if (!dtoTitle?.uz || !dtoTitle?.ru || !dtoTitle?.en)
        throw new BadRequestException(
          'Barcha tillar uchun sarlavha (uz, ru, en) kiritilishi shart',
        );

      // 3. Noyoblikni tekshirish
      const existingFood = await this.foodTypeRepository
        .createQueryBuilder('foods')
        .where("foods.title->>'uz' = :uz", { uz: dtoTitle.uz.trim() })
        .orWhere("foods.title->>'ru' = :ru", { ru: dtoTitle.ru.trim() })
        .orWhere("foods.title->>'en' = :en", { en: dtoTitle.en.trim() })
        .getOne();

      if (existingFood) {
        throw new ConflictException(
          'Ovqat nomi (title) har bir til bo‘yicha noyob bo‘lishi kerak',
        );
      }

      // 4. Sequence avtomatik
      const lastFood = await this.foodTypeRepository
        .createQueryBuilder('food')
        .orderBy('food.sequence', 'DESC')
        .getOne();

      const nextSequence = lastFood ? lastFood.sequence + 1 : 1;

      // 5. isActive default true
      dto['isActive'] = true;
      dto['sequence'] = nextSequence;

      // 🚀 MUHIM: title ni object qilib beramiz
      const food = this.foodTypeRepository.create({
        ...dto,
        title: dtoTitle,
      });

      return await this.foodTypeRepository.save(food);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // BadRequest bo‘lsa qaytaramiz
      }
      if (error instanceof ConflictException) {
        throw error; // NotFound bo‘lsa qaytaramiz
      }
      throw new InternalServerErrorException(
        `Ovqat qo'shishda xato: ${error.message}`,
      );
    }
  }

  // Barcha ovqatlarni olish
  async findAll() {
    try {
      return await this.foodTypeRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        `Ovqatlarni olishda xato: ${error.message}`,
      );
    }
  }

  // ID bo'yicha ovqatni olish
  async findOne(id: string) {
    try {
      const food = await this.foodTypeRepository.findOne({ where: { id }});
      if (!food) throw new NotFoundException('Ovqat topilmadi');
      return food;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        console.log(error),
        
        `Bitta Ovqatni olishda serverda xatolik yuz berdi ${error.message}`,
      );
    }
  }




  async update(id: string, dto: UpdateFoodTypeDto) {
  try {
    const food = await this.findOne(id); // mavjud ovqatni topamiz

    // 1. Title yangilash
    if (dto.title !== undefined && dto.title !== null && dto.title !== '') {
      let dtoTitle: { uz: string; ru: string; en: string };
      try {
        dtoTitle = typeof dto.title === 'string' ? JSON.parse(dto.title) : dto.title;
      } catch (e) {
        throw new BadRequestException('DTO.title JSON emas yoki noto‘g‘ri formatda');
      }

      const existingFood = await this.foodTypeRepository
        .createQueryBuilder('foods')
        .where("foods.title->>'uz' = :uz", { uz: dtoTitle.uz.trim() })
        .orWhere("foods.title->>'ru' = :ru", { ru: dtoTitle.ru.trim() })
        .orWhere("foods.title->>'en' = :en", { en: dtoTitle.en.trim() })
        .andWhere('foods.id != :id', { id })
        .getOne();

      if (existingFood) {
        throw new ConflictException('Ovqat nomi (title) har bir til bo‘yicha noyob bo‘lishi kerak');
      }
      food.title = dtoTitle;
    }

    // 2. isActive yangilash
    if (dto.isActive !== undefined && dto.isActive !== null ) {  // && dto.isActive !== ''
      food.isActive = dto.isActive;
    }

    // 3. Image yangilash
    if (dto.image !== undefined && dto.image !== null && dto.image !== '') {
      food.image = dto.image;
    }

    return await this.foodTypeRepository.save(food);
  } catch (error) {
    if (error instanceof BadRequestException) throw error;
    if (error instanceof ConflictException) throw error;

    throw new InternalServerErrorException(`Ovqatni yangilashda xato: ${error.message}`);
  }
}

  // Ovqatni yangilash
//   async update(id: string, dto: UpdateFoodTypeDto) {
//     try {
//       const food = await this.findOne(id); // mavjud ovqatni topamiz
//       Object.keys(dto).forEach((key) => {
//   const value = dto[key];
//   if (value !== null && value !== undefined && value !== "") {
//     food[key] = value;
//   }
// });

// console.log("sdsdsdsds",dto);

//       // 1. Agar title bo‘lsa, JSON parse qilamiz
//       if (dto.title !== undefined || dto.title !== null || dto.title !== '') {
//         let dtoTitle: { uz: string; ru: string; en: string };
//         try {
//           dtoTitle =
//             typeof dto.title === 'string' ? JSON.parse(dto.title) : dto.title;
//         } catch (e) {
//           throw new BadRequestException(
//             'DTO.title JSON emas yoki noto‘g‘ri formatda',
//           );
//         }

//         // if (!dtoTitle?.uz || !dtoTitle?.ru || !dtoTitle?.en)
//         //   throw new BadRequestException(
//         //     'Barcha tillar uchun sarlavha (uz, ru, en) kiritilishi shart',
//         //   );

//         // title noyobligini tekshirish
//         const existingFood = await this.foodRepository
//           .createQueryBuilder('foods')
//           .where("foods.title->>'uz' = :uz", { uz: dtoTitle.uz.trim() })
//           .orWhere("foods.title->>'ru' = :ru", { ru: dtoTitle.ru.trim() })
//           .orWhere("foods.title->>'en' = :en", { en: dtoTitle.en.trim() })
//           .andWhere('foods.id != :id', { id })
//           .getOne();

//         if (existingFood) {
//           throw new ConflictException(
//             'Ovqat nomi (title) har bir til bo‘yicha noyob bo‘lishi kerak',
//           );
//         }
//         food.title = dtoTitle; // faqat title yangilanadi
//       }else{
//         food.title
//       }

//       // 2. isActive yangilanishi kerak bo‘lsa
//       if (dto.isActive !== undefined || dto.isActive !== null || dto.isActive !== '') {
//         food.isActive = dto.isActive;
//       }else{
//         food.isActive
//       }

//       // 3. image yangilanishi kerak bo‘lsa
//       if (dto.image !== undefined && dto.image !== null) {
//         food.image = dto.image;
//       }else{
//         food.image
//       }
// //       Object.keys(dto).forEach((key) => {
// //   const value = dto[key];
// //   if (value !== null && value !== undefined && value !== "") {
// //     food[key] = value;
// //   }
// // });                 /// updae ahr birini alohida 
//       // 🔥 boshqa fieldlar qo‘shmoqchi bo‘lsangiz, xuddi shu tartibda tekshirib yozasiz

//       return await this.foodRepository.save(food);
//     } catch (error) {
//       if (error instanceof BadRequestException) throw error;
//       if (error instanceof ConflictException) throw error;
//       console.log("sfsfssdgd",error.message);
      
//       throw new InternalServerErrorException(
//         `Ovqatni yangilashda xato: ${error.message}`,
//       );
//     }
//   }

  // Ovqatni o'chirish
 
  async remove(id: string): Promise<{ message: string }> {
    try {
      const food = await this.findOne(id);
      await this.foodTypeRepository.remove(food);
      return { message: 'Ovqat muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      throw new Error(`Ovqatni o'chirishda xato: ${error.message}`);
    }
  }

  async updateSequence(foodId: string, dto: FoodTypeSequenceDto) {
  try {
    const food = await this.foodTypeRepository.findOneBy({ id: foodId });
    if (!food) throw new NotFoundException('Food not found');

    const currentSeq = food.sequence;
    const newSeq = dto.sequence;

    if (currentSeq === newSeq) return { message: 'Sequence o‘zgarmadi' };

    if (currentSeq < newSeq) {
      await this.foodTypeRepository
        .createQueryBuilder()
        .update(FoodTypesEntity)
        .set({ sequence: () => `"sequence" - 1` })
        .where('"sequence" > :current AND "sequence" <= :newSeq', {
          current: currentSeq,
          newSeq,
        })
        .execute();
    } else {
      await this.foodTypeRepository
        .createQueryBuilder()
        .update(FoodTypesEntity)
        .set({ sequence: () => `"sequence" + 1` })
        .where('"sequence" >= :newSeq AND "sequence" < :current', {
          current: currentSeq,
          newSeq,
        })
        .execute();
    }

    food.sequence = newSeq;
    await this.foodTypeRepository.save(food);

    return { message: 'Sequence muvaffaqiyatli yangilandi' };
  } catch (error) {
    console.error(error);
    throw new InternalServerErrorException(
      'Internal server error', error.message
    );
  }
}

}
