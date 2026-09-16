import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CollectionTileSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    href: { type: String, required: true },
    image: { type: String, default: "" },
    bg: { type: String, default: "from-[#be9c7d] to-[#878c64]" },
  },
  { _id: false },
);

const HomeMediaSchema = new Schema(
  {
    key: { type: String, default: "default", unique: true, index: true },
    aboutPhoneBanner: { type: String, default: "" },
    aboutVideoPoster: { type: String, default: "" },
    aboutVideoUrl: { type: String, default: "" },
    aboutCollage: { type: [String], default: [] },
    collections: { type: [CollectionTileSchema], default: [] },
  },
  { timestamps: true },
);

export type HomeMediaDoc = InferSchemaType<typeof HomeMediaSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.HomeMedia) {
  delete mongoose.models.HomeMedia;
}

const HomeMedia: Model<HomeMediaDoc> = mongoose.model<HomeMediaDoc>(
  "HomeMedia",
  HomeMediaSchema,
);

export default HomeMedia;
