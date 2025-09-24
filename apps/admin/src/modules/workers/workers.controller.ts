// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   HttpCode,
//   HttpStatus,
// } from '@nestjs/common';
// import {
//   ApiBadRequestResponse,
//   ApiCreatedResponse,
//   ApiOkResponse,
//   ApiTags,
//   ApiNotFoundResponse,
//   ApiConflictResponse,
// } from '@nestjs/swagger';
// import { WorkersService } from './workers.service';
// import { CreateWorkerDto, UpdateWorkerDto } from './workers.dto';

// @ApiTags('Workers') // Swagger uchun bo‘lim nomi
// @Controller('workers')
// export class WorkersController {
//   constructor(private readonly workersService: WorkersService) {}

//   // 🟢 CREATE
//   @Post()
//   @HttpCode(HttpStatus.CREATED)
//   @ApiCreatedResponse({ description: '✅ Yangi xodim muvaffaqiyatli yaratildi' })
//   @ApiBadRequestResponse({ description: '❌ Yaroqsiz maʼlumot kiritildi (masalan, noto‘g‘ri role yoki phone format)' })
//   @ApiConflictResponse({ description: '❌ Ushbu telefon raqam allaqachon mavjud' })
//   async create(@Body() dto: CreateWorkerDto) {
//     return await this.workersService.create(dto);
//   }

//   // 🟢 FIND ALL
//   @Get()
//   @HttpCode(HttpStatus.OK)
//   @ApiOkResponse({ description: '✅ Barcha xodimlar ro‘yxati' })
//   async findAll() {
//     return await this.workersService.findAll();
//   }

//   // 🟢 FIND ONE
//   @Get(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOkResponse({ description: '✅ ID bo‘yicha xodim topildi' })
//   @ApiNotFoundResponse({ description: '❌ Bunday ID bilan xodim topilmadi' })
//   async findOne(@Param('id') id: string) {
//     return await this.workersService.findOne(id);
//   }

//   // 🟢 UPDATE
//   @Patch(':id')
//   @HttpCode(HttpStatus.OK)
//   @ApiOkResponse({ description: '✅ Xodim maʼlumotlari yangilandi' })
//   @ApiBadRequestResponse({ description: '❌ Yaroqsiz maʼlumot kiritildi' })
//   @ApiNotFoundResponse({ description: '❌ Yangilanishi kerak bo‘lgan xodim topilmadi' })
//   @ApiConflictResponse({ description: '❌ Ushbu telefon raqam boshqa xodimda mavjud' })
//   async update(@Param('id') id: string, @Body() dto: UpdateWorkerDto) {
//     return await this.workersService.update(id, dto);
//   }

//   // 🟢 DELETE
//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   @ApiOkResponse({ description: '✅ Xodim muvaffaqiyatli o‘chirildi' })
//   @ApiNotFoundResponse({ description: '❌ O‘chirilishi kerak bo‘lgan xodim topilmadi' })
//   async remove(@Param('id') id: string): Promise<void> {
//     return await this.workersService.remove(id);
//   }
// }


import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { WorkersService } from './workers.service';
import { CreateWorkerDto, UpdateWorkerDto } from './workers.dto';

@ApiTags('Workers') // Swagger uchun bo‘lim nomi
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  // 🟢 CREATE
  @Post()
  @HttpCode(HttpStatus.CREATED)
   @ApiOperation({ summary: 'Ishchi qo`shish' })
  @ApiCreatedResponse({ description: '✅ Yangi xodim muvaffaqiyatli yaratildi' })
  @ApiBadRequestResponse({
    description:
      '❌ Yaroqsiz maʼlumot kiritildi (masalan, noto‘g‘ri role yoki phone format)',
  })
  @ApiConflictResponse({ description: '❌ Ushbu telefon raqam allaqachon mavjud' })
  async create(@Body() dto: CreateWorkerDto) {
    return await this.workersService.create(dto);
  }

  // 🟢 FIND ALL
  @Get()
  @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Barcha ishchilar malumotini olish' })
  @ApiOkResponse({ description: '✅ Barcha xodimlar ro‘yxati' })
  async findAll() {
    return await this.workersService.findAll();
  }

  // 🟢 FIND ONE
  @Get(':id')
  @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'ID bo‘yicha bitta ishchini olish' })
  @ApiOkResponse({ description: '✅ ID bo‘yicha xodim topildi' })
  @ApiNotFoundResponse({ description: '❌ Bunday ID bilan xodim topilmadi' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.workersService.findOne(id);
  }

  // 🟢 UPDATE
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
   @ApiOperation({ summary: 'Ishchi ma`luotlarini yangilash' })
  @ApiOkResponse({ description: '✅ Xodim maʼlumotlari yangilandi' })
  @ApiBadRequestResponse({ description: '❌ Yaroqsiz maʼlumot kiritildi' })
  @ApiNotFoundResponse({
    description: '❌ Yangilanishi kerak bo‘lgan xodim topilmadi',
  })
  @ApiConflictResponse({
    description: '❌ Ushbu telefon raqam boshqa xodimda mavjud',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateWorkerDto,
  ) {
    return await this.workersService.update(id, dto);
  }

  // 🟢 DELETE
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
   @ApiOperation({ summary: ' Ishchi malumotlarini o`chirish' })
  @ApiNoContentResponse({ description: '✅ Xodim muvaffaqiyatli o‘chirildi' })
  @ApiNotFoundResponse({ description: '❌ O‘chirilishi kerak bo‘lgan xodim topilmadi' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return await this.workersService.remove(id);
  }
}
