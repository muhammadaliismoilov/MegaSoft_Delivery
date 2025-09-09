import { Expose } from "class-transformer";

export class RestaurantResponseDto {
  id: string;

  name: string;



    @Expose({ name: 'address', toPlainOnly: true })
  address: string;
}

