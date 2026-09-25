import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    size: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    weightKg: { type: Number, default: 0.4 },
  },
  { _id: false },
);

const AddressSnapshotSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false },
);

const TimelineSchema = new Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    /** Human-readable id (also PhonePe merchantOrderId) */
    orderNumber: { type: String, required: true, unique: true, index: true },
    /** @deprecated alias — kept for older rows / PhonePe */
    merchantOrderId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, default: "", index: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    /** Legacy mirror of shippingFee */
    shipping: { type: Number, required: true, default: 0 },
    codFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["prepaid", "cod"],
      default: "prepaid",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    status: {
      type: String,
      enum: [
        "pending_payment",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        // legacy
        "pending",
        "paid",
        "failed",
      ],
      default: "pending_payment",
      index: true,
    },
    shippingAddress: { type: AddressSnapshotSchema },
    billingAddress: { type: AddressSnapshotSchema },
    // Flat address fields for backwards compatibility / admin table
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phonepeOrderId: { type: String, default: "" },
    phonepeTransactionId: { type: String, default: "" },
    shiprocketOrderId: { type: String, default: "" },
    shiprocketShipmentId: { type: String, default: "" },
    awb: { type: String, default: "" },
    courier: { type: String, default: "" },
    trackingUrl: { type: String, default: "" },
    timeline: { type: [TimelineSchema], default: [] },
    cancelReason: { type: String, default: "" },
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
