import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsController {
    private readonly service;
    constructor(service: StudentsService);
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
    findAll(page?: string, limit?: string, search?: string): Promise<{
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
        success: boolean;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            studentCode: string;
            fullName: string;
            citizenId: string | null;
            groupId: number | null;
        };
    }>;
    update(id: number, updateDto: UpdateStudentDto): Promise<{
        success: boolean;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            studentCode: string;
            fullName: string;
            citizenId: string | null;
            groupId: number | null;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
