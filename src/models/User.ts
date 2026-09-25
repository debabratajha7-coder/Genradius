import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AddressSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

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
    addresses: { type: [AddressSchema], default: [] },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<UserDoc> = mongoose.model<UserDoc>("User", UserSchema);

export default User;
