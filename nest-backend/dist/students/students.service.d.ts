import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserPayload } from '../common/types';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateStudentDto, user: UserPayload): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    }>;
    findAll(user: UserPayload, page?: number, limit?: number, search?: string): Promise<{
        data: ({
            group: {
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                id: number;
                name: string;
                degreeId: number | null;
                departmentId: number | null;
                advisorId: number | null;
            } | null;
        } & {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            studentCode: string;
            fullName: string;
            citizenId: string | null;
            groupId: number | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number, user: UserPayload): Promise<{
        group: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            name: string;
            degreeId: number | null;
            departmentId: number | null;
            advisorId: number | null;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    }>;
    update(id: number, updateDto: UpdateStudentDto, user: UserPayload): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    }>;
    remove(id: number, user: UserPayload): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        studentCode: string;
        fullName: string;
        citizenId: string | null;
        groupId: number | null;
    }>;
}
