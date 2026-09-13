export type ProductSeries = "christian" | "anime" | "marvel_dc" | "regular";
export type ProductStatus = "published" | "draft" | "coming_soon";

export interface ProductColour {
  name: string;
  hex: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  series: ProductSeries;
  status: ProductStatus;
  stock: number;
  lowStockThreshold: number;
  sizes: string[];
  colours: ProductColour[];
  hasColourSwitcher: boolean;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  location: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  size: string;
  colour: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  receiptNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  mpesaRef: string | null;
  orderStatus: OrderStatus;
  receiptUrl: string | null;
  whatsappSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CustomOrderPlacement = "left_chest" | "center_chest" | "full_back" | "left_sleeve";
export type CustomOrderStatus = "pending" | "in_review" | "confirmed" | "completed" | "cancelled";

export interface CustomOrder {
  _id: string;
  receiptNumber: string;
  customer: OrderCustomer;
  garmentType: string;
  placement: CustomOrderPlacement;
  notes: string;
  referenceImages: string[];
  status: CustomOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  title: string;
  slug: string;
  image: string;
  size: string;
  colour: string;
  qty: number;
  unitPrice: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface Settings {
  businessName: string;
  whatsappAdminNumber: string;
  shippingFee: number;
  currency: string;
  featuredProductId: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
