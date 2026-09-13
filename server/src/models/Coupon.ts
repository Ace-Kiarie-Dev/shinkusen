import { Schema, model, type Document } from "mongoose";

export type CouponType = "percent" | "fixed";

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number;
  active: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default model<ICoupon>("Coupon", couponSchema);
