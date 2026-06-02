import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  price: number;

  @IsInt()
  @Min(1)
  deliveryDays: number;
}
