import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    phone: { type: String, sparse: true, unique: true, index: true },
    email: { type: String, sparse: true, unique: true, index: true },
    googleId: { type: String, sparse: true, unique: true, index: true },
    passwordHash: { type: String, default: "" },
    name: { type: String, default: "" },
    provider: {
      type: String,
      enum: ["phone", "email", "google"],
      default: "phone",
    },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

// Re-register when schema changes (dev hot reload keeps stale models otherwise)
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<UserDoc> = mongoose.model<UserDoc>("User", UserSchema);

export default User;
