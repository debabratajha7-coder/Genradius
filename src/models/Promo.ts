import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const PromoSchema = new Schema(
  {
    text: { type: String, required: true },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type PromoDoc = InferSchemaType<typeof PromoSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Promo: Model<PromoDoc> =
  mongoose.models.Promo || mongoose.model<PromoDoc>("Promo", PromoSchema);

export default Promo;
