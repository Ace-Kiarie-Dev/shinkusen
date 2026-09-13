import api from "./api";
import type { ApiResponse, AuthUser, Product, Settings } from "@/types";

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface DashboardStats {
  revenue: number;
  orderCount: number;
  pendingOrderCount: number;
  lowStockProducts: Product[];
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<ApiResponse<LoginResponse>>("/auth/login", { email, password });
  if (!data.data) throw new Error("Login failed");
  return data.data;
}

export async function fetchSettings(): Promise<Settings | undefined> {
  const { data } = await api.get<ApiResponse<Settings>>("/settings");
  return data.data;
}

export async function updateSettings(payload: Partial<Settings>): Promise<Settings | undefined> {
  const { data } = await api.put<ApiResponse<Settings>>("/settings", payload);
  return data.data;
}

export async function fetchDashboardStats(): Promise<DashboardStats | undefined> {
  const { data } = await api.get<ApiResponse<DashboardStats>>("/dashboard/stats");
  return data.data;
}
