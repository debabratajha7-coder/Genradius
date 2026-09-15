import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ReelSchema = new Schema(
  {
    title: { type: String, required: true },
    instagramUrl: { type: String, required: true },
    embedUrl: { type: String, required: true },
    shortcode: { type: String, required: true, index: true },
    thumbnailUrl: { type: String, default: "" },
    productSlug: { type: String, default: "" },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type ReelDoc = InferSchemaType<typeof ReelSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Reel: Model<ReelDoc> =
  mongoose.models.Reel || mongoose.model<ReelDoc>("Reel", ReelSchema);

export default Reel;
