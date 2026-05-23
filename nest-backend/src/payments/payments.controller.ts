import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserPayload } from '../common/types';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(Role.ADMIN, Role.ADVISOR)
  @Post()
  @ApiOperation({ summary: 'Add a new payment' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentsService.create(createPaymentDto);
    return { success: true, data: payment };
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  async findAll(@CurrentUser() user: UserPayload) {
    const data = await this.paymentsService.findAll(user);
    return { success: true, data };
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payments by order id' })
  async findByOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @CurrentUser() user: UserPayload,
  ) {
    const data = await this.paymentsService.findByOrder(orderId, user);
    return { success: true, data };
  }
}
