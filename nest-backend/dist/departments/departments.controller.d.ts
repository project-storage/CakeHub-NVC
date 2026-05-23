import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentsController {
    private readonly service;
    constructor(service: DepartmentsService);
    create(createDto: CreateDepartmentDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        departmentName: string;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            departmentName: string;
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
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            departmentName: string;
        };
    }>;
    update(id: number, updateDto: UpdateDepartmentDto): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            departmentName: string;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
