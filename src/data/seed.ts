import "dotenv/config";
import mongoose from "mongoose";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_PROMOS,
} from "./catalog";
import Category from "../models/Category";
import Product from "../models/Product";
import Promo from "../models/Promo";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI in .env.local before seeding.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected.");

  await Promise.all([
    Promo.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ]);

  await Promo.insertMany(SEED_PROMOS);
  await Category.insertMany(SEED_CATEGORIES);
  await Product.insertMany(
    SEED_PRODUCTS.map((p) => ({
      ...p,
      stockBySize: p.stockBySize,
    })),
  );

  console.log(
    `Seeded ${SEED_PROMOS.length} promos, ${SEED_CATEGORIES.length} categories, ${SEED_PRODUCTS.length} products.`,
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
