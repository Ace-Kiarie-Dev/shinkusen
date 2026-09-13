import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import { connectDB } from "../config/db";
import Product from "../models/Product";

function placeholder(label: string): string {
  return `https://placehold.co/800x1000/0a0a0a/DC143C?text=${encodeURIComponent(label)}`;
}

const SEED_PRODUCTS = [
  {
    title: "Isaiah Crimson Tee",
    slug: "isaiah-crimson-tee",
    description:
      "A wash of scarlet across black cotton, quoting Isaiah 1:18 down the sleeve. Heavyweight 240gsm tee with a boxy fit.",
    price: 2500,
    series: "christian" as const,
    status: "published" as const,
    stock: 25,
    lowStockThreshold: 5,
    sizes: ["S", "M", "L", "XL"],
    colours: [
      { name: "Black", hex: "#0a0a0a" },
      { name: "Crimson", hex: "#DC143C" },
    ],
    hasColourSwitcher: true,
    images: [placeholder("Isaiah Crimson Tee")],
    featured: true,
  },
  {
    title: "Ronin Hoodie",
    slug: "ronin-hoodie",
    description:
      "Anime silhouette printed across the back, minimal front branding. Fleece lined hoodie built for Nairobi evenings.",
    price: 4500,
    series: "anime" as const,
    status: "published" as const,
    stock: 15,
    lowStockThreshold: 5,
    sizes: ["M", "L", "XL", "XXL"],
    colours: [{ name: "Black", hex: "#0a0a0a" }],
    hasColourSwitcher: false,
    images: [placeholder("Ronin Hoodie")],
    featured: true,
  },
  {
    title: "Gotham Nights Tee",
    slug: "gotham-nights-tee",
    description: "Dark knight inspired graphic tee for the DC faithful. 220gsm cotton, relaxed fit.",
    price: 2800,
    series: "marvel_dc" as const,
    status: "published" as const,
    stock: 20,
    lowStockThreshold: 5,
    sizes: ["S", "M", "L", "XL"],
    colours: [{ name: "Black", hex: "#0a0a0a" }],
    hasColourSwitcher: false,
    images: [placeholder("Gotham Nights Tee")],
    featured: false,
  },
  {
    title: "Nairobi Sweatpants",
    slug: "nairobi-sweatpants",
    description: "Everyday sweatpants with a tapered leg and side pocket detailing. Built to move.",
    price: 3500,
    series: "regular" as const,
    status: "published" as const,
    stock: 3,
    lowStockThreshold: 5,
    sizes: ["S", "M", "L", "XL"],
    colours: [
      { name: "Black", hex: "#0a0a0a" },
      { name: "Grey", hex: "#888888" },
    ],
    hasColourSwitcher: true,
    images: [placeholder("Nairobi Sweatpants")],
    featured: false,
  },
  {
    title: "Scarlet Snow Hoodie",
    slug: "scarlet-snow-hoodie",
    description: "Coming soon. The next drop in the Christian series, previewing before release.",
    price: 5000,
    series: "christian" as const,
    status: "coming_soon" as const,
    stock: 0,
    lowStockThreshold: 5,
    sizes: ["S", "M", "L", "XL"],
    colours: [{ name: "Black", hex: "#0a0a0a" }],
    hasColourSwitcher: false,
    images: [placeholder("Scarlet Snow Hoodie")],
    featured: false,
  },
];

async function seedProducts(): Promise<void> {
  await connectDB();

  for (const product of SEED_PRODUCTS) {
    const existing = await Product.findOne({ slug: product.slug });

    if (existing) {
      console.log(`Product already exists, skipping: ${product.slug}`);
      continue;
    }

    await Product.create(product);
    console.log(`Seeded product: ${product.title}`);
  }

  await mongoose.disconnect();
}

seedProducts()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("Failed to seed products:", err);
    process.exit(1);
  });
