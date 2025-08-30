import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class RestaurantResponseDto {
    @Expose({ name: 'name', toPlainOnly: true })
    @IsString()
    name: string;

    @Expose({ name: 'address', toPlainOnly: true })
    @IsString()
    address: string;

    @Expose({ name: 'description', toPlainOnly: true })
    @IsString()
    description: string;

    @Expose({ name: 'image_url', toPlainOnly: true })
    @IsString()
    imageUrl: string;

    @Expose({ name: 'lat', toPlainOnly: true })
    @Type(() => Number)
    @IsNumber()
    lat: number;

    @Expose({ name: 'long', toPlainOnly: true })
    @Type(() => Number)
    @IsNumber()
    long: number;

    @Expose({ name: 'free_delivery', toPlainOnly: true })
    @IsBoolean()
    freeDelivery: boolean;

    @Expose({ name: 'is_open', toPlainOnly: true })
    @IsBoolean()
    isOpen: boolean;
}


export class RestaurantCreateDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsUUID()
    organizationId: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    lat: number;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    long: number;

    @ApiProperty()
    @IsBoolean()
    freeDelivery: boolean;

    @ApiProperty()
    @IsBoolean()
    isOpen: boolean;
}


export class RestaurantUpdateDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    organizationId?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    lat?: number;

    @ApiPropertyOptional()
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    long?: number;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    freeDelivery?: boolean;

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isOpen?: boolean;
}
