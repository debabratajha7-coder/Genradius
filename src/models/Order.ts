import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    size: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    merchantOrderId: { type: String, required: true, unique: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    total: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "shipped"],
      default: "pending",
      index: true,
    },
    phonepeOrderId: { type: String, default: "" },
    shiprocketOrderId: { type: String, default: "" },
    shiprocketShipmentId: { type: String, default: "" },
    courier: { type: String, default: "" },
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof OrderSchema> & {
  _id: mongoose.Types.ObjectId;
};

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

const Order: Model<OrderDoc> = mongoose.model<OrderDoc>("Order", OrderSchema);

export default Order;
