import { Configuration, Value } from "@itgorillaz/configify";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

@Configuration()
export class AppConfig {
 @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @Value('PORT')
  port: number;

  @IsString()
  @IsNotEmpty()
  @Value('DB_NAME')
  dbName: string;

  @IsString()
  @IsNotEmpty()
  @Value('DB_PASSWORD')
  dbPassword: string;

  @IsString()
  @IsNotEmpty()
  @Value('DB_USERNAME')
  dbUsername: string;

  @IsString()
  @IsNotEmpty()
  @Value('DB_HOST')
  dbHost: string;

   @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @Value('DB_PORT')
  dbPort: number;
}