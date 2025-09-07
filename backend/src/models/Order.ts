import mongoose, { Document } from "mongoose";

export type OrderStatus =
    | "PENDING"
    | "SUBMITTED"
    | "VERIFIED"
    | "EXPIRED"
    | "CANCELLED";

export interface IOrder extends Document {
    orderId: string;
    amount: number;
    vpa: string;
    merchantName: string;
    note?: string;
    upiLink?: string;
    status: OrderStatus;
    utr?: string | null;
    expiresAt?: Date;
    createdAt?: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>(
    {
        orderId: { type: String, required: true, unique: true, index: true },
        amount: { type: Number, required: true },
        vpa: { type: String, required: true },
        merchantName: { type: String, default: "Merchant" },
        note: { type: String },
        upiLink: { type: String },
        status: {
            type: String,
            enum: ["PENDING", "SUBMITTED", "VERIFIED", "EXPIRED", "CANCELLED"],
            default: "PENDING",
        },
        utr: { type: String, default: null },
        expiresAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
