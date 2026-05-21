import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  studentCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  citizenId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  groupId?: number;

}
