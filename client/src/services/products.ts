import api from "./api";
import type { ApiResponse, Product, ProductSeries, ProductStatus } from "@/types";

export async function fetchProducts(filters?: { series?: ProductSeries; status?: ProductStatus }): Promise<Product[]> {
  const { data } = await api.get<ApiResponse<Product[]>>("/products", { params: filters });
  return data.data ?? [];
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const { data } = await api.get<ApiResponse<Product>>(`/products/${slug}`);
  if (!data.data) throw new Error("Product not found");
  return data.data;
}

export async function fetchAllProductsAdmin(): Promise<Product[]> {
  const { data } = await api.get<ApiResponse<Product[]>>("/products/admin/all");
  return data.data ?? [];
}

export async function fetchProductByIdAdmin(id: string): Promise<Product> {
  const { data } = await api.get<ApiResponse<Product>>(`/products/admin/${id}`);
  if (!data.data) throw new Error("Product not found");
  return data.data;
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const { data } = await api.post<ApiResponse<Product>>("/products", payload);
  if (!data.data) throw new Error("Failed to create product");
  return data.data;
}

export async function updateProduct(id: string, payload: Partial<Product>): Promise<Product> {
  const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, payload);
  if (!data.data) throw new Error("Failed to update product");
  return data.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const { data } = await api.post<ApiResponse<{ urls: string[] }>>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data.data?.urls ?? [];
}
