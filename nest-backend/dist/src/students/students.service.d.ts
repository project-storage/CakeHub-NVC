import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateStudentDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            studentCode: string;
            fullName: string;
            citizenId: string | null;
            groupId: number | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    }>;
    update(id: number, updateDto: UpdateStudentDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    }>;
}
