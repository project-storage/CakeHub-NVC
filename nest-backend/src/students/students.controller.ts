import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Roles(Role.ADMIN, Role.ADVISOR)
  @Post()
  @ApiOperation({ summary: 'Create student' })
  create(@Body() createDto: CreateStudentDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    const result = await this.service.findAll(+(page || 1), +(limit || 10), search);
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by id' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(id);
    return { success: true, data };
  }

  @Roles(Role.ADMIN, Role.ADVISOR)
  @Patch(':id')
  @ApiOperation({ summary: 'Update student' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateStudentDto) {
    const data = await this.service.update(id, updateDto);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete student' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { success: true, message: 'Student deleted' };
  }
}
