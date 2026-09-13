import { Schema, model, type Document, type Types } from "mongoose";

export type ProductSeries = "christian" | "anime" | "marvel_dc" | "regular";
export type ProductStatus = "published" | "draft" | "coming_soon";

export interface IProductColour {
  name: string;
  hex: string;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  series: ProductSeries;
  status: ProductStatus;
  stock: number;
  lowStockThreshold: number;
  sizes: string[];
  colours: IProductColour[];
  hasColourSwitcher: boolean;
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const colourSchema = new Schema<IProductColour>(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    series: {
      type: String,
      enum: ["christian", "anime", "marvel_dc", "regular"],
      required: true,
    },
    status: {
      type: String,
      enum: ["published", "draft", "coming_soon"],
      default: "draft",
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    sizes: { type: [String], default: [] },
    colours: { type: [colourSchema], default: [] },
    hasColourSwitcher: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

productSchema.index({ series: 1, status: 1 });

export default model<IProduct>("Product", productSchema);
