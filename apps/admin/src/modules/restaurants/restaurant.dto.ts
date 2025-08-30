import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class RestaurantCreateDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    address: string;

    @ApiProperty()
    @IsUUID()
    organizationId: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    lat: number;

    @ApiProperty()
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
    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    organizationId?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    lat?: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    long?: number;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    freeDelivery?: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isOpen?: boolean;
}
