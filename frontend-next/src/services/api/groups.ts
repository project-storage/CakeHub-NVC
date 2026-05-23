import { apiClient } from "./client";

export interface Advisor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Degree {
  id: number;
  degreeName: string;
}

export interface Department {
  id: number;
  departmentName: string;
}

export interface Group {
  id: number;
  name: string;
  advisorId?: number | null;
  advisor?: Advisor | null;
  degreeId?: number | null;
  degree?: Degree | null;
  departmentId?: number | null;
  department?: Department | null;
  createdAt: string;
  updatedAt: string;
}

export const groupService = {
  findAll: async () => {
    const response = await apiClient.get("groups").json<{
      success: boolean;
      data: Group[];
    }>();
    return response.data;
  },
  create: async (data: any) => {
    const response = await apiClient.post("groups", { json: data }).json<{ success: boolean; data: Group }>();
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await apiClient.patch(`groups/${id}`, { json: data }).json<{ success: boolean; data: Group }>();
    return response.data;
  },
  delete: async (id: number) => {
    await apiClient.delete(`groups/${id}`);
  },
};
