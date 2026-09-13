import api from "./api";
import type { ApiResponse, CustomOrder, CustomOrderPlacement, Order } from "@/types";

export interface CreateOrderPayload {
  customer: {
    name: string;
    phone: string;
    email?: string;
    location: string;
  };
  items: {
    productId: string;
    size: string;
    colour: string;
    qty: number;
  }[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<ApiResponse<Order>>("/orders", payload);
  if (!data.data) throw new Error("Failed to create order");
  return data.data;
}

export async function trackOrderByReceipt(receipt: string): Promise<Order> {
  const { data } = await api.get<ApiResponse<Order>>("/orders/track", { params: { receipt } });
  if (!data.data) throw new Error("Order not found");
  return data.data;
}

export async function trackOrdersByPhone(phone: string): Promise<Order[]> {
  const { data } = await api.get<ApiResponse<Order[]>>("/orders/track", { params: { phone } });
  return data.data ?? [];
}

export async function fetchAllOrdersAdmin(): Promise<Order[]> {
  const { data } = await api.get<ApiResponse<Order[]>>("/orders");
  return data.data ?? [];
}

export async function updateOrderStatus(id: string, orderStatus: Order["orderStatus"]): Promise<Order> {
  const { data } = await api.put<ApiResponse<Order>>(`/orders/${id}`, { orderStatus });
  if (!data.data) throw new Error("Failed to update order");
  return data.data;
}

export interface CreateCustomOrderPayload {
  customer: {
    name: string;
    phone: string;
    email?: string;
    location: string;
  };
  garmentType: string;
  placement: CustomOrderPlacement;
  notes?: string;
  referenceImages?: string[];
}

export async function createCustomOrder(payload: CreateCustomOrderPayload): Promise<CustomOrder> {
  const { data } = await api.post<ApiResponse<CustomOrder>>("/custom-orders", payload);
  if (!data.data) throw new Error("Failed to create custom order");
  return data.data;
}

export async function fetchAllCustomOrdersAdmin(): Promise<CustomOrder[]> {
  const { data } = await api.get<ApiResponse<CustomOrder[]>>("/custom-orders");
  return data.data ?? [];
}

export async function updateCustomOrderStatus(
  id: string,
  status: CustomOrder["status"],
): Promise<CustomOrder> {
  const { data } = await api.put<ApiResponse<CustomOrder>>(`/custom-orders/${id}`, { status });
  if (!data.data) throw new Error("Failed to update custom order");
  return data.data;
}
