import { PrismaService } from '../prisma/prisma.service';
import { CreateCakeDto } from './dto/create-cake.dto';
import { UpdateCakeDto } from './dto/update-cake.dto';
export declare class CakesService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findAll(page?: number, limit?: number, search?: string): Promise<{
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
    }>;
    findOne(id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        cakeName: string;
        price: number;
        pound: number;
        stock: number;
    }>;
    update(id: number, updateDto: UpdateCakeDto): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        cakeName: string;
        price: number;
        pound: number;
        stock: number;
    }>;
    remove(id: number): Promise<{
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        id: number;
        cakeName: string;
        price: number;
        pound: number;
        stock: number;
    }>;
}
