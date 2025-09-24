// import { RoleEnum } from '@delivery/db/db/enums/base.enum';
// import { ApiProperty, PartialType } from '@nestjs/swagger';
// import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, IsUUID } from 'class-validator';

// export class CreateWorkerDto {
//   @ApiProperty({
//     example: 'Ali',
//     description: 'Xodimning to‘liq ismi (kamida 2 ta, maksimal 50 ta belgi bo‘lishi kerak)',
//   })
//   @IsNotEmpty({ message: 'Ism bo‘sh bo‘lishi mumkin emas' })
//   @IsString({ message: 'Ism faqat matn bo‘lishi kerak' })
//   @Length(2, 50, { message: 'Ism uzunligi 2 va 50 belgidan iborat bo‘lishi kerak' })
//   fullName: string;

//   @ApiProperty({
//     example: '998901234567',
//     description: 'Xodimning telefon raqami (9-13 ta belgi, yagona bo‘lishi shart)',
//   })
//   @IsNotEmpty({ message: 'Telefon raqam bo‘sh bo‘lishi mumkin emas' })
//   @IsString({ message: 'Telefon raqam faqat matn bo‘lishi kerak' })
//   @Length(9, 13, { message: 'Telefon raqam uzunligi 9 va 13 belgidan iborat bo‘lishi kerak' })
//   phone: string;

//   @ApiProperty({
//     example: RoleEnum.Chef,
//     description: 'Xodimning lavozimi (faqat quyidagi qiymatlardan biri bo‘lishi mumkin)',
//     enum: RoleEnum,
//     enumName: 'RoleEnum',
//   })
//   @IsNotEmpty({ message: 'Lavozim tanlanishi kerak' })
//   @IsEnum(RoleEnum, { message: 'Noto‘g‘ri lavozim kiritildi' })
//   role: RoleEnum;

//   @ApiProperty({
//     example: 'a3f8c9e2-1c34-4b5a-8c9e-93d48a7d1b0f',
//     description: 'Xodim ishlaydigan restoran ID-si (UUID formatida)',
//   })
//   @IsNotEmpty({ message: 'Restoran ID bo‘sh bo‘lishi mumkin emas' })
//   @IsUUID('4', { message: 'Restoran ID noto‘g‘ri formatda (UUID v4 bo‘lishi kerak)' })
//   restaurantId: string;
// }

// export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
//   @ApiProperty({
//     example: 'Hasan',
//     description: 'Xodimning yangi to‘liq ismi (ixtiyoriy)',
//     required: false,
//   })
//   @IsOptional()
//   @IsString({ message: 'Ism faqat matn bo‘lishi kerak' })
//   @Length(2, 50, { message: 'Ism uzunligi 2 va 50 belgidan iborat bo‘lishi kerak' })
//   fullName?: string;

//   @ApiProperty({
//     example: '998935551122',
//     description: 'Xodimning yangi telefon raqami (ixtiyoriy)',
//     required: false,
//   })
//   @IsOptional()
//   @IsString({ message: 'Telefon raqam faqat matn bo‘lishi kerak' })
//   @Length(9, 13, { message: 'Telefon raqam uzunligi 9 va 13 belgidan iborat bo‘lishi kerak' })
//   phone?: string;

//   @ApiProperty({
//     example: RoleEnum.Operator,
//     description: 'Xodimning yangi lavozimi (ixtiyoriy, faqat belgilangan enum qiymatlar)',
//     enum: RoleEnum,
//     required: false,
//   })
//   @IsOptional()
//   @IsEnum(RoleEnum, { message: 'Noto‘g‘ri lavozim kiritildi' })
//   role?: RoleEnum;

//   @ApiProperty({
//     example: 'b7d9e8f1-6e45-4f8c-9a3d-7f98d9c2a5e6',
//     description: 'Xodimning yangi restoran ID-si (UUID formatida, ixtiyoriy)',
//     required: false,
//   })
//   @IsOptional()
//   @IsUUID('4', { message: 'Restoran ID noto‘g‘ri formatda (UUID v4 bo‘lishi kerak)' })
//   restaurantId?: string;
// }


import { RoleEnum } from '@delivery/db/db/enums/base.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, IsEnum } from 'class-validator';

export class CreateWorkerDto {
  @ApiProperty({
    example: 'Ali',
    description: 'Xodimning ismi (kamida 2 ta belgi, maksimal 50 ta belgi)',
  })
  @IsNotEmpty({ message: 'Ism kiritilishi shart' })
  @IsString({ message: 'Ism faqat matn bo‘lishi kerak' })
  @Length(2, 50, { message: 'Ism uzunligi 2 dan 50 belgigacha bo‘lishi kerak' })
  fullName: string;

  @ApiProperty({
    example: '998901234567',
    description: 'Xodimning telefon raqami (9-13 ta belgi, yagona bo‘lishi shart)',
  })
  @IsNotEmpty({ message: 'Telefon raqami kiritilishi shart' })
  @IsString({ message: 'Telefon raqami faqat matn bo‘lishi kerak' })
  @Length(9, 13, { message: 'Telefon raqami 9 dan 13 belgigacha bo‘lishi kerak' })
  phone: string;

  @ApiProperty({
    example: RoleEnum.Chef,
    description: 'Xodimning lavozimi (faqat quyidagi qiymatlardan biri bo‘lishi mumkin)',
    enum: RoleEnum,
    enumName: 'RoleEnum',
  })
  @IsNotEmpty({ message: 'Lavozim tanlanishi kerak' })
  @IsEnum(RoleEnum, { message: 'Noto‘g‘ri lavozim kiritildi' })
  role: RoleEnum;

  @ApiProperty({
    example: 'a3f8c9e2-1c34-4b5a-8c9e-93d48a7d1b0f',
    description: 'Xodim ishlaydigan restoran ID-si (UUID formatida)',
  })
  @IsNotEmpty({ message: 'Restoran ID kiritilishi kerak' })
  @IsString({ message: 'Restoran ID faqat matn bo‘lishi kerak' })
  restaurantId: string;
}

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @ApiProperty({
    example: 'Hasan',
    description: 'Xodimning yangi ismi (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Ism faqat matn bo‘lishi kerak' })
  @Length(2, 50, { message: 'Ism uzunligi 2 dan 50 belgigacha bo‘lishi kerak' })
  fullName?: string;

  @ApiProperty({
    example: '998935551122',
    description: 'Xodimning yangi telefon raqami (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefon raqami faqat matn bo‘lishi kerak' })
  @Length(9, 13, { message: 'Telefon raqami 9 dan 13 belgigacha bo‘lishi kerak' })
  phone?: string;

  @ApiProperty({
    example: RoleEnum.Operator,
    description: 'Xodimning yangi lavozimi (ixtiyoriy, faqat enum qiymatlaridan biri)',
    enum: RoleEnum,
    enumName: 'RoleEnum',
    required: false,
  })
  @IsOptional()
  @IsEnum(RoleEnum, { message: 'Noto‘g‘ri lavozim kiritildi' })
  role?: RoleEnum;

  @ApiProperty({
    example: 'b7d9e8f1-6e45-4f8c-9a3d-7f98d9c2a5e6',
    description: 'Xodimning yangi restoran ID-si (ixtiyoriy)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Restoran ID faqat matn bo‘lishi kerak' })
  restaurantId?: string;
}
