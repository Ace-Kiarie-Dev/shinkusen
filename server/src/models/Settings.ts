import { Schema, model, type Document, type Types } from "mongoose";

export interface ISettings extends Document {
  businessName: string;
  whatsappAdminNumber: string;
  shippingFee: number;
  currency: string;
  featuredProductId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    businessName: { type: String, required: true, default: "SHINKUSEN" },
    whatsappAdminNumber: { type: String, required: true, default: "" },
    shippingFee: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "KES" },
    featuredProductId: { type: Schema.Types.ObjectId, ref: "Product", default: null },
  },
  { timestamps: true },
);

export default model<ISettings>("Settings", settingsSchema);
