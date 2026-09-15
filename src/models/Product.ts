import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number, required: true },
    badges: { type: [String], default: [] },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    categorySlugs: { type: [String], default: [], index: true },
    sizes: { type: [String], default: ["S", "M", "L", "XL", "XXL"] },
    stockBySize: { type: Map, of: Number, default: {} },
    featured: { type: Boolean, default: false, index: true },
    collectionTags: { type: [String], default: [], index: true },
    active: { type: Boolean, default: true, index: true },
    bestPrice: { type: Number },
  },
  { timestamps: true },
);

export type ProductDoc = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Product: Model<ProductDoc> =
  mongoose.models.Product ||
  mongoose.model<ProductDoc>("Product", ProductSchema);

export default Product;
