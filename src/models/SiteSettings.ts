import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    freeShippingThreshold: { type: Number, default: 1000 },
    shippingFee: { type: Number, default: 99 },
    codFee: { type: Number, default: 49 },
    codEnabled: { type: Boolean, default: true },
    emiEnabled: { type: Boolean, default: false },
    pickupLocationName: { type: String, default: "Primary" },
  },
  { timestamps: true },
);

export type SiteSettingsDoc = InferSchemaType<typeof SiteSettingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}

const SiteSettings: Model<SiteSettingsDoc> = mongoose.model<SiteSettingsDoc>(
  "SiteSettings",
  SiteSettingsSchema,
);

export default SiteSettings;
