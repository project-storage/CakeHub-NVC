import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UserPayload } from '../common/types';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateGroupDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        name: string;
        degreeId: number | null;
        departmentId: number | null;
        advisorId: number | null;
    }>;
    findAll(user: UserPayload, page?: number, limit?: number, search?: string): Promise<{
        data: ({
            department: {
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                id: number;
                departmentName: string;
            } | null;
            degree: {
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                id: number;
                degreeName: string;
            } | null;
            advisor: {
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.Role;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                id: number;
            } | null;
        } & {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            name: string;
            degreeId: number | null;
            departmentId: number | null;
            advisorId: number | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number, user: UserPayload): Promise<{
        department: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            departmentName: string;
        } | null;
        degree: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            degreeName: string;
        } | null;
        advisor: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        name: string;
        degreeId: number | null;
        departmentId: number | null;
        advisorId: number | null;
    }>;
    update(id: number, updateDto: UpdateGroupDto, user: UserPayload): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        name: string;
        degreeId: number | null;
        departmentId: number | null;
        advisorId: number | null;
    }>;
    remove(id: number, user: UserPayload): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        name: string;
        degreeId: number | null;
        departmentId: number | null;
        advisorId: number | null;
    }>;
}
