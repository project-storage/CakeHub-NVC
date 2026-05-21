import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateDepartmentDto) {
    return this.prisma.department.create({ data: createDto as any });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.DepartmentWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { departmentName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.department.findMany({ where, skip, take: limit }),
      this.prisma.department.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const record = await this.prisma.department.findFirst({ where: { id, deletedAt: null } });
    if (!record) throw new NotFoundException('Department not found');
    return record;
  }

  async update(id: number, updateDto: UpdateDepartmentDto) {
    await this.findOne(id);
    return this.prisma.department.update({ where: { id }, data: updateDto as any });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.department.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
