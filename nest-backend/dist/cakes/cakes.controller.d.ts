import { CakesService } from './cakes.service';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';
export declare class CakesController {
    private readonly service;
    constructor(service: CakesService);
    create(createDto: CreateCakeDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        cakeName: string;
        price: number;
        pound: number;
        stock: number;
    }>;
    findAll(page?: string, limit?: string, search?: string): Promise<{
        data: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            cakeName: string;
            price: number;
            pound: number;
            stock: number;
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
            cakeName: string;
            price: number;
            pound: number;
            stock: number;
        };
    }>;
    update(id: number, updateDto: UpdateCakeDto): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            cakeName: string;
            price: number;
            pound: number;
            stock: number;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
