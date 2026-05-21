import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateStudentDto) {
    return this.prisma.student.create({ data: createDto as any });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { studentCode: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({ where, skip, take: limit }),
      this.prisma.student.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const record = await this.prisma.student.findFirst({ where: { id, deletedAt: null } });
    if (!record) throw new NotFoundException('Student not found');
    return record;
  }

  async update(id: number, updateDto: UpdateStudentDto) {
    await this.findOne(id);
    return this.prisma.student.update({ where: { id }, data: updateDto as any });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.student.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
