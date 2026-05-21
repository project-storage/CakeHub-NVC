import { IsNumber, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class OrderDetailDto {
  @ApiProperty()
  @IsNumber()
  cakeId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  studentId?: number;

  @ApiProperty()
  @IsNumber()
  totalPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  depositAmount?: number;

  @ApiProperty({ type: [OrderDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  orderDetails: OrderDetailDto[];
}

export class UpdateOrderDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
