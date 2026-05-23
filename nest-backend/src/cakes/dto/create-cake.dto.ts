import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCakeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  cakeName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pound: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
