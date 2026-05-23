import { Controller, Get, UseGuards, Query, Res } from '@nestjs/common';
import { ReportService } from './report.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Response } from 'express';

@ApiTags('Report')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Roles(Role.ADMIN)
  @Get('order-summary')
  @ApiOperation({ summary: 'Order Summary Report' })
  @ApiQuery({ name: 'export', enum: ['json', 'excel', 'pdf'], required: false })
  async getOrderSummary(
    @Query('export') exportType: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (exportType === 'excel' || exportType === 'pdf') {
      return this.reportService.getOrderSummary(res, exportType);
    }
    const data = await this.reportService.getOrderSummary();
    res.json({ success: true, data });
  }

  @Roles(Role.ADMIN)
  @Get('revenue-summary')
  @ApiOperation({ summary: 'Revenue Summary Report' })
  @ApiQuery({ name: 'export', enum: ['json', 'excel', 'pdf'], required: false })
  async getRevenueSummary(
    @Query('export') exportType: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (exportType === 'excel' || exportType === 'pdf') {
      return this.reportService.getRevenueSummary(res, exportType);
    }
    const data = await this.reportService.getRevenueSummary();
    res.json({ success: true, data });
  }

  @Roles(Role.ADMIN)
  @Get('total-cake')
  @ApiOperation({ summary: 'Total Cake Report' })
  async getTotalCakeReport() {
    const data = await this.reportService.getTotalCakeReport();
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Get('department')
  @ApiOperation({ summary: 'Department Report' })
  async getDepartmentReport() {
    const data = await this.reportService.getDepartmentReport();
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Get('student-order')
  @ApiOperation({ summary: 'Student Order Report' })
  async getStudentOrderReport() {
    const data = await this.reportService.getStudentOrderReport();
    return { success: true, data };
  }
}
