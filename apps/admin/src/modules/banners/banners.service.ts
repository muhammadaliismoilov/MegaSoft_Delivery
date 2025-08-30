import { DataSource, InjectDb } from '@delivery/db/db';
import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create_banner_dto';

@Injectable()
export class BannersService {
    constructor(
        @InjectDb() private readonly db: DataSource,
    ){}

    async createBannerImages(bannerData: CreateBannerDto){
        const newBanner = await this.db.insert()
    }
}
