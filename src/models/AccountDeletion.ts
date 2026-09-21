import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/** Keeps anonymized deletion feedback — no PII after account wipe */
const AccountDeletionSchema = new Schema(
  {
    reason: { type: String, required: true },
    details: { type: String, default: "" },
    provider: { type: String, default: "" },
  },
  { timestamps: true },
);

export type AccountDeletionDoc = InferSchemaType<
  typeof AccountDeletionSchema
> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.AccountDeletion) {
  delete mongoose.models.AccountDeletion;
}

const AccountDeletion: Model<AccountDeletionDoc> =
  mongoose.model<AccountDeletionDoc>("AccountDeletion", AccountDeletionSchema);

export default AccountDeletion;
