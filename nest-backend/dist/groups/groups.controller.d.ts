import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UserPayload } from '../common/types';
export declare class GroupsController {
    private readonly service;
    constructor(service: GroupsService);
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
    findAll(user: UserPayload, page?: string, limit?: string, search?: string): Promise<{
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
        success: boolean;
    }>;
    findOne(id: number, user: UserPayload): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    update(id: number, updateDto: UpdateGroupDto, user: UserPayload): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            name: string;
            degreeId: number | null;
            departmentId: number | null;
            advisorId: number | null;
        };
    }>;
    remove(id: number, user: UserPayload): Promise<{
        success: boolean;
        message: string;
    }>;
}
