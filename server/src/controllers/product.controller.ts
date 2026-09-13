import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import Product, { type ProductSeries, type ProductStatus } from "../models/Product";

const PUBLIC_STATUSES: ProductStatus[] = ["published", "coming_soon"];
const VALID_SERIES: ProductSeries[] = ["christian", "anime", "marvel_dc", "regular"];
const VALID_STATUSES: ProductStatus[] = ["published", "draft", "coming_soon"];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Product.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });

    if (!existing) {
      return slug;
    }

    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  const { series, status } = req.query as { series?: string; status?: string };

  const filter: Record<string, unknown> = { status: { $in: PUBLIC_STATUSES } };

  if (series && VALID_SERIES.includes(series as ProductSeries)) {
    filter.series = series;
  }

  if (status && PUBLIC_STATUSES.includes(status as ProductStatus)) {
    filter.status = status;
  }

  const products = await Product.find(filter).sort({ createdAt: -1 });

  res.json({ success: true, data: products });
}

export async function getProductBySlug(req: Request, res: Response): Promise<void> {
  const product = await Product.findOne({ slug: req.params.slug, status: { $in: PUBLIC_STATUSES } });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({ success: true, data: product });
}

export async function getAllProductsAdmin(_req: Request, res: Response): Promise<void> {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, data: products });
}

export async function getProductByIdAdmin(req: Request, res: Response): Promise<void> {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({ success: true, data: product });
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<{
    title: string;
    description: string;
    price: number;
    series: ProductSeries;
    status: ProductStatus;
    stock: number;
    lowStockThreshold: number;
    sizes: string[];
    colours: { name: string; hex: string }[];
    hasColourSwitcher: boolean;
    images: string[];
    featured: boolean;
  }>;

  if (!body.title || !body.description || body.price === undefined || !body.series) {
    throw new AppError("title, description, price, and series are required", 400);
  }

  if (!VALID_SERIES.includes(body.series)) {
    throw new AppError("Invalid series", 400);
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    throw new AppError("Invalid status", 400);
  }

  const slug = await generateUniqueSlug(body.title);

  const product = await Product.create({
    title: body.title,
    slug,
    description: body.description,
    price: body.price,
    series: body.series,
    status: body.status ?? "draft",
    stock: body.stock ?? 0,
    lowStockThreshold: body.lowStockThreshold ?? 5,
    sizes: body.sizes ?? [],
    colours: body.colours ?? [],
    hasColourSwitcher: body.hasColourSwitcher ?? false,
    images: body.images ?? [],
    featured: body.featured ?? false,
  });

  res.status(201).json({ success: true, data: product });
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const body = req.body as Partial<{
    title: string;
    description: string;
    price: number;
    series: ProductSeries;
    status: ProductStatus;
    stock: number;
    lowStockThreshold: number;
    sizes: string[];
    colours: { name: string; hex: string }[];
    hasColourSwitcher: boolean;
    images: string[];
    featured: boolean;
  }>;

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (body.series && !VALID_SERIES.includes(body.series)) {
    throw new AppError("Invalid series", 400);
  }

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    throw new AppError("Invalid status", 400);
  }

  if (body.title && body.title !== product.title) {
    product.slug = await generateUniqueSlug(body.title, id);
    product.title = body.title;
  }

  if (body.description !== undefined) product.description = body.description;
  if (body.price !== undefined) product.price = body.price;
  if (body.series !== undefined) product.series = body.series;
  if (body.status !== undefined) product.status = body.status;
  if (body.stock !== undefined) product.stock = body.stock;
  if (body.lowStockThreshold !== undefined) product.lowStockThreshold = body.lowStockThreshold;
  if (body.sizes !== undefined) product.sizes = body.sizes;
  if (body.colours !== undefined) product.colours = body.colours;
  if (body.hasColourSwitcher !== undefined) product.hasColourSwitcher = body.hasColourSwitcher;
  if (body.images !== undefined) product.images = body.images;
  if (body.featured !== undefined) product.featured = body.featured;

  await product.save();

  res.json({ success: true, data: product });
}

export async function deleteProduct(req: Request, res: Response): Promise<void> {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({ success: true, data: { id: req.params.id } });
}
