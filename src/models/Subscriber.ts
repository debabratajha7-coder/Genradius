import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    source: {
      type: String,
      enum: ["footer", "admin", "import"],
      default: "footer",
    },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export type SubscriberDoc = InferSchemaType<typeof SubscriberSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.Subscriber) {
  delete mongoose.models.Subscriber;
}

const Subscriber: Model<SubscriberDoc> = mongoose.model<SubscriberDoc>(
  "Subscriber",
  SubscriberSchema,
);

export default Subscriber;
