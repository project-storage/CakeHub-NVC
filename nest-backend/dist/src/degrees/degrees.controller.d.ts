import { DegreesService } from './degrees.service';
import { CreateDegreeDto } from './dto/create-degree.dto';
import { UpdateDegreeDto } from './dto/update-degree.dto';
export declare class DegreesController {
    private readonly service;
    constructor(service: DegreesService);
    create(createDto: CreateDegreeDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        degreeName: string;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            degreeName: string;
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
            degreeName: string;
        };
    }>;
    update(id: number, updateDto: UpdateDegreeDto): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            degreeName: string;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
