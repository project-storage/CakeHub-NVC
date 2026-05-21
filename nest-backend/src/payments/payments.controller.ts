import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Add a new payment' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentsService.create(createPaymentDto);
    return { success: true, data: payment };
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  async findAll() {
    const data = await this.paymentsService.findAll();
    return { success: true, data };
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payments by order id' })
  async findByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    const data = await this.paymentsService.findByOrder(orderId);
    return { success: true, data };
  }
}
