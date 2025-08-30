import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBannerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    restaurant_id: string;

    @IsString()
    @IsNotEmpty()
    product_id: string;

    @IsBoolean()
    is_active: boolean;

    @IsDate()
    start_date: Date;

    @IsDate()
    end_date: Date;

    @IsNumber()
    sequence: number;
}