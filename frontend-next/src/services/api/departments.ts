import { apiClient } from "./client";

export interface Department {
  id: number;
  departmentName: string;
}

export const departmentService = {
  findAll: async () => {
    const response = await apiClient.get("departments").json<{
      success: boolean;
      data: Department[];
    }>();
    return response.data;
  },
};
