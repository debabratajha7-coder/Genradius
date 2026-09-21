import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { ALL_ADMIN_PERMISSIONS } from "@/lib/admin-permissions";

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" },
    phone: { type: String, required: true, index: true },
    role: {
      type: String,
      enum: ["owner", "staff"],
      default: "staff",
      index: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
    active: { type: Boolean, default: true, index: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.AdminUser) {
  delete mongoose.models.AdminUser;
}

const AdminUser: Model<AdminUserDoc> = mongoose.model<AdminUserDoc>(
  "AdminUser",
  AdminUserSchema,
);

export default AdminUser;

export { ALL_ADMIN_PERMISSIONS };
