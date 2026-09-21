import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const HighlightSchema = new Schema(
  {
    title: { type: String, required: true },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const SpecSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const ReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 5 },
    date: { type: String, default: "" },
    body: { type: String, default: "" },
    verified: { type: Boolean, default: true },
  },
  { _id: false },
);

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
    offerTitle: { type: String, default: "" },
    offerDetail: { type: String, default: "" },
    offerPrice: { type: Number },
    socialProof: { type: String, default: "" },
    sizeGuideImage: { type: String, default: "" },
    highlights: { type: [HighlightSchema], default: [] },
    specs: { type: [SpecSchema], default: [] },
    careFit: { type: String, default: "" },
    reviews: { type: [ReviewSchema], default: [] },
  },
  { timestamps: true },
);

export type ProductDoc = InferSchemaType<typeof ProductSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}

const Product: Model<ProductDoc> = mongoose.model<ProductDoc>(
  "Product",
  ProductSchema,
);

export default Product;
