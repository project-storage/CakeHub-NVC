import { apiClient } from "./client";

export interface Degree {
  id: number;
  degreeName: string;
}

export const degreeService = {
  findAll: async () => {
    const response = await apiClient.get("degrees").json<{
      success: boolean;
      data: Degree[];
    }>();
    return response.data;
  },
};
