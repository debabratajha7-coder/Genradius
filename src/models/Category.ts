import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type CategoryDoc = InferSchemaType<typeof CategorySchema> & {
  _id: mongoose.Types.ObjectId;
};

const Category: Model<CategoryDoc> =
  mongoose.models.Category ||
  mongoose.model<CategoryDoc>("Category", CategorySchema);

export default Category;
