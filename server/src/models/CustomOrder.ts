import { Schema, model, type Document } from "mongoose";

export type CustomOrderPlacement = "left_chest" | "center_chest" | "full_back" | "left_sleeve";
export type CustomOrderStatus = "pending" | "in_review" | "confirmed" | "completed" | "cancelled";

export interface ICustomOrderCustomer {
  name: string;
  phone: string;
  email?: string;
  location: string;
}

export interface ICustomOrder extends Document {
  receiptNumber: string;
  customer: ICustomOrderCustomer;
  garmentType: string;
  placement: CustomOrderPlacement;
  notes: string;
  referenceImages: string[];
  status: CustomOrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const customOrderCustomerSchema = new Schema<ICustomOrderCustomer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const customOrderSchema = new Schema<ICustomOrder>(
  {
    receiptNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: customOrderCustomerSchema, required: true },
    garmentType: { type: String, required: true, trim: true },
    placement: {
      type: String,
      enum: ["left_chest", "center_chest", "full_back", "left_sleeve"],
      required: true,
    },
    notes: { type: String, default: "" },
    referenceImages: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "in_review", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default model<ICustomOrder>("CustomOrder", customOrderSchema);
