import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Prisma, Role } from '@prisma/client';
import { UserPayload } from '../common/types';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateGroupDto) {
    const { advisorId, degreeId, departmentId, ...rest } = createDto;
    return this.prisma.group.create({
      data: {
        ...rest,
        advisorId,
        degreeId,
        departmentId,
      },
    });
  }

  async findAll(
    user: UserPayload,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.GroupWhereInput = {
      deletedAt: null,
      ...(user.role === Role.ADVISOR && { advisorId: user.id }),
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.group.findMany({
        where,
        skip,
        take: limit,
        include: { degree: true, department: true, advisor: true },
      }),
      this.prisma.group.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number, user: UserPayload) {
    const record = await this.prisma.group.findFirst({
      where: { id, deletedAt: null },
      include: { degree: true, department: true, advisor: true },
    });

    if (!record) throw new NotFoundException('Group not found');

    if (user.role === Role.ADVISOR && record.advisorId !== user.id) {
      throw new ForbiddenException('You do not have access to this group');
    }

    return record;
  }

  async update(id: number, updateDto: UpdateGroupDto, user: UserPayload) {
    await this.findOne(id, user);
    const { advisorId, degreeId, departmentId, ...rest } = updateDto;
    return this.prisma.group.update({
      where: { id },
      data: {
        ...rest,
        advisorId,
        degreeId,
        departmentId,
      },
    });
  }

  async remove(id: number, user: UserPayload) {
    await this.findOne(id, user);
    return this.prisma.group.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
