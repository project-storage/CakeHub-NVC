import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
export declare class GroupsController {
    private readonly service;
    constructor(service: GroupsService);
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
    findAll(page?: string, limit?: string, search?: string): Promise<{
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
        success: boolean;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            advisor: string | null;
            degreeId: number | null;
            departmentId: number | null;
        };
    }>;
    update(id: number, updateDto: UpdateGroupDto): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            advisor: string | null;
            degreeId: number | null;
            departmentId: number | null;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
