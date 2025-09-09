import { 
  Controller, 
  Get, 
  Param, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { FoodTypesService } from './food_types.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Food Types') // Swagger gruppasi
@Controller('food-types')
export class FoodTypesController {
  constructor(private readonly foodTypesService: FoodTypesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Barcha food type larni olish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli barcha food type lar qaytarildi.' })
  @ApiResponse({ status: 404, description: 'Food type lar topilmadi.' })
  findAll() {
    return this.foodTypesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID orqali food type olish' })
  @ApiParam({ name: 'id', type: String, description: 'Food type ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Food type topildi va qaytarildi.' })
  @ApiResponse({ status: 404, description: 'Berilgan ID bo‘yicha food type topilmadi.' })
  findOne(@Param('id') id: string) {
    return this.foodTypesService.findOne(id);
  }
}
