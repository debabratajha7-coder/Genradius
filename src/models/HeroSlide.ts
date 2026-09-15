import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const HeroSlideSchema = new Schema(
  {
    image: { type: String, required: true },
    eyebrow: { type: String, default: "DROP" },
    title: { type: String, required: true },
    highlight: { type: String, default: "" },
    href: { type: String, default: "/shop" },
    ctaLabel: { type: String, default: "Shop now" },
    active: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

export type HeroSlideDoc = InferSchemaType<typeof HeroSlideSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.HeroSlide) {
  delete mongoose.models.HeroSlide;
}

const HeroSlide: Model<HeroSlideDoc> = mongoose.model<HeroSlideDoc>(
  "HeroSlide",
  HeroSlideSchema,
);

export default HeroSlide;
