import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateGroupDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        advisor: string | null;
        degreeId: number | null;
        departmentId: number | null;
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            advisor: string | null;
            degreeId: number | null;
            departmentId: number | null;
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
        name: string;
        advisor: string | null;
        degreeId: number | null;
        departmentId: number | null;
    }>;
    update(id: number, updateDto: UpdateGroupDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        advisor: string | null;
        degreeId: number | null;
        departmentId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        advisor: string | null;
        degreeId: number | null;
        departmentId: number | null;
    }>;
}
