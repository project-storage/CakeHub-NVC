import { z } from "zod";

const numericOptionalSchema = z.union([z.number(), z.string()]).pipe(z.coerce.number()).optional().nullable();

export const studentSchema = z.object({
  studentCode: z.string().min(5, "Student code is required"),
  fullName: z.string().min(2, "Full name is required"),
  citizenId: z.string().optional().nullable(),
  groupId: numericOptionalSchema,
});

export type StudentDto = z.infer<typeof studentSchema>;
export type StudentInput = z.input<typeof studentSchema>;

export interface Student extends StudentDto {
  id: number;
  group?: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
