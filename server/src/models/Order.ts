import { Schema, model, type Document, type Types } from "mongoose";

export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrderCustomer {
  name: string;
  phone: string;
  email?: string;
  location: string;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  title: string;
  size: string;
  colour: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  receiptNumber: string;
  customer: IOrderCustomer;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  mpesaRef: string | null;
  orderStatus: OrderStatus;
  receiptUrl: string | null;
  whatsappSent: boolean;
  mpesaCheckoutRequestId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const orderCustomerSchema = new Schema<IOrderCustomer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    size: { type: String, required: true },
    colour: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    receiptNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: orderCustomerSchema, required: true },
    items: { type: [orderItemSchema], required: true, validate: (v: IOrderItem[]) => v.length > 0 },
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    mpesaRef: { type: String, default: null },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    receiptUrl: { type: String, default: null },
    whatsappSent: { type: Boolean, default: false },
    mpesaCheckoutRequestId: { type: String, default: null, index: true },
  },
  { timestamps: true },
);

orderSchema.index({ "customer.phone": 1 });

export default model<IOrder>("Order", orderSchema);
