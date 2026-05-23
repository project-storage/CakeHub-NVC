import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  advisorId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  degreeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  departmentId?: number;
}
