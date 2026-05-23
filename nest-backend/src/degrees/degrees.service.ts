import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DegreesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateDegreeDto) {
    return this.prisma.degree.create({ data: createDto });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.DegreeWhereInput = {
      deletedAt: null,
      ...(search && {
        degreeName: { contains: search, mode: 'insensitive' },
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.degree.findMany({ where, skip, take: limit }),
      this.prisma.degree.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const record = await this.prisma.degree.findFirst({
      where: { id, deletedAt: null },
    });
    if (!record) throw new NotFoundException('Degree not found');
    return record;
  }

  async update(id: number, updateDto: UpdateDegreeDto) {
    await this.findOne(id);
    return this.prisma.degree.update({ where: { id }, data: updateDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.degree.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
