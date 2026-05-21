import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CakesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCakeDto) {
    return this.prisma.cake.create({ data: createDto as any });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.CakeWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { cakeName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.cake.findMany({ where, skip, take: limit }),
      this.prisma.cake.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const record = await this.prisma.cake.findFirst({ where: { id, deletedAt: null } });
    if (!record) throw new NotFoundException('Cake not found');
    return record;
  }

  async update(id: number, updateDto: UpdateCakeDto) {
    await this.findOne(id);
    return this.prisma.cake.update({ where: { id }, data: updateDto as any });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cake.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
