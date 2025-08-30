import { Configuration, Value } from "@itgorillaz/configify";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@Configuration()
export class AppConfig {
  @IsNumber()
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

  @IsNumber()
  @IsNotEmpty()
  @Value('DB_PORT')
  dbPort: number;
}