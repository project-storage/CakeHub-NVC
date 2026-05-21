import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateGroupDto) {
    return this.prisma.group.create({ data: createDto as any });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.GroupWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { advisor: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.group.findMany({ where, skip, take: limit }),
      this.prisma.group.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const record = await this.prisma.group.findFirst({ where: { id, deletedAt: null } });
    if (!record) throw new NotFoundException('Group not found');
    return record;
  }

  async update(id: number, updateDto: UpdateGroupDto) {
    await this.findOne(id);
    return this.prisma.group.update({ where: { id }, data: updateDto as any });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.group.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
