import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Prisma, Role } from '@prisma/client';
import { UserPayload } from '../common/types';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateStudentDto, user: UserPayload) {
    if (user.role === Role.ADVISOR) {
      if (!createDto.groupId) {
        throw new BadRequestException('Group ID is required for advisors');
      }
      const group = await this.prisma.group.findFirst({
        where: { id: createDto.groupId, advisorId: user.id },
      });
      if (!group) {
        throw new ForbiddenException('You do not have access to this group');
      }
    }
    return this.prisma.student.create({ data: createDto });
  }

  async findAll(
    user: UserPayload,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    // If advisor, find groups they manage
    let groupIds: number[] = [];
    if (user.role === Role.ADVISOR) {
      const groups = await this.prisma.group.findMany({
        where: { advisorId: user.id },
        select: { id: true },
      });
      groupIds = groups.map((g) => g.id);
    }

    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      ...(user.role === Role.ADVISOR && { groupId: { in: groupIds } }),
      ...(search && {
        OR: [
          { studentCode: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: { group: true },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number, user: UserPayload) {
    const record = await this.prisma.student.findFirst({
      where: { id, deletedAt: null },
      include: { group: true },
    });

    if (!record) throw new NotFoundException('Student not found');

    if (user.role === Role.ADVISOR) {
      if (!record.groupId)
        throw new ForbiddenException('You do not have access to this student');
      const group = await this.prisma.group.findFirst({
        where: { id: record.groupId, advisorId: user.id },
      });
      if (!group)
        throw new ForbiddenException('You do not have access to this student');
    }

    return record;
  }

  async update(id: number, updateDto: UpdateStudentDto, user: UserPayload) {
    await this.findOne(id, user);

    if (user.role === Role.ADVISOR && updateDto.groupId) {
      const group = await this.prisma.group.findFirst({
        where: { id: updateDto.groupId, advisorId: user.id },
      });
      if (!group) {
        throw new ForbiddenException('You do not have access to this group');
      }
    }

    return this.prisma.student.update({ where: { id }, data: updateDto });
  }

  async remove(id: number, user: UserPayload) {
    await this.findOne(id, user);
    return this.prisma.student.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
