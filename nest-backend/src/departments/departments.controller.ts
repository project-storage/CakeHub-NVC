import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  @Roles(Role.ADMIN, Role.ADVISOR)
  @Post()
  @ApiOperation({ summary: 'Create department' })
  create(@Body() createDto: CreateDepartmentDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    const result = await this.service.findAll(+(page || 1), +(limit || 10), search);
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(id);
    return { success: true, data };
  }

  @Roles(Role.ADMIN, Role.ADVISOR)
  @Patch(':id')
  @ApiOperation({ summary: 'Update department' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDepartmentDto) {
    const data = await this.service.update(id, updateDto);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete department' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { success: true, message: 'Department deleted' };
  }
}
