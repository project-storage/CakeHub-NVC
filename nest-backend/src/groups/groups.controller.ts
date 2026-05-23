import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserPayload } from '../common/types';

@ApiTags('Groups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly service: GroupsService) {}

  @Roles(Role.ADMIN, Role.ADVISOR)
  @Post()
  @ApiOperation({ summary: 'Create group' })
  create(@Body() createDto: CreateGroupDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups' })
  async findAll(
    @CurrentUser() user: UserPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const result = await this.service.findAll(
      user,
      +(page || 1),
      +(limit || 10),
      search,
    );
    return { success: true, ...result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by id' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    const data = await this.service.findOne(id, user);
    return { success: true, data };
  }

  @Roles(Role.ADMIN, Role.ADVISOR)
  @Patch(':id')
  @ApiOperation({ summary: 'Update group' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGroupDto,
    @CurrentUser() user: UserPayload,
  ) {
    const data = await this.service.update(id, updateDto, user);
    return { success: true, data };
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserPayload,
  ) {
    await this.service.remove(id, user);
    return { success: true, message: 'Group deleted' };
  }
}
