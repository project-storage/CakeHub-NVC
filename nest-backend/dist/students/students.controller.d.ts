import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserPayload } from '../common/types';
export declare class StudentsController {
    private readonly service;
    constructor(service: StudentsService);
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
    findAll(user: UserPayload, page?: string, limit?: string, search?: string): Promise<{
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
        success: boolean;
    }>;
    findOne(id: number, user: UserPayload): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
    update(id: number, updateDto: UpdateStudentDto, user: UserPayload): Promise<{
        success: boolean;
        data: {
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            id: number;
            studentCode: string;
            fullName: string;
            citizenId: string | null;
            groupId: number | null;
        };
    }>;
    remove(id: number, user: UserPayload): Promise<{
        success: boolean;
        message: string;
    }>;
}
