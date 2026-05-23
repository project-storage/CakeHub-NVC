import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDegreeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  degreeName: string;
}
