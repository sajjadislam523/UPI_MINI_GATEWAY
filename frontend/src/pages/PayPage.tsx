import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CopyButton from "../components/CopyButton";
import { providerUri } from "../lib/upi";
import type { OrderPublic } from "../types/types";

const methods = ["PhonePe", "Paytm", "Google Pay", "UPI"];

export default function PayPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<OrderPublic | null>(null);
    const [utr, setUtr] = useState("");
    const [loading, setLoading] = useState(true);
    const api = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (!orderId) return;
        (async () => {
            try {
                const r = await axios.get<OrderPublic>(
                    `${api}/api/orders/${orderId}`
                );
                setOrder(r.data);
            } catch (err) {
                alert("Order not found");
            } finally {
                setLoading(false);
            }
        })();
    }, [orderId, api]);

    if (loading) return <div>Loading…</div>;
    if (!order) return <div>Order not found</div>;

    const onPay = (method: string) => {
        const uri = providerUri(
            method,
            order.upiLink || "",
            order.maskedVpa.replace(/\*+/g, ""),
            order.amount
        );
        window.location.href = uri;
    };

    const submitUtr = async () => {
        try {
            await axios.post(`${api}/api/orders/${orderId}/utr`, { utr });
            alert("UTR Submitted.");
        } catch (err: any) {
            alert(err?.response?.data?.message || "Error");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Pay ₹{order.amount}</h2>
                <div className="text-sm text-gray-600">
                    Order: {order.orderId}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <div className="mb-3">
                        VPA:{" "}
                        <strong className="font-mono">{order.maskedVpa}</strong>
                    </div>
                    <div className="flex gap-2 mb-4">
                        <CopyButton
                            text={String(order.amount)}
                            label="COPY AMOUNT"
                        />
                        <CopyButton
                            text={order.maskedVpa.replace(/\*+/g, "")}
                            label="COPY VPA"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {methods.map((m) => (
                            <button
                                key={m}
                                onClick={() => onPay(m)}
                                className="border rounded p-4 text-center hover:bg-gray-50"
                            >
                                <div className="mb-2 font-medium">{m}</div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6">
                        <label className="block mb-1">
                            Enter UTR after payment
                        </label>
                        <input
                            className="w-full p-3 border rounded"
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                        />
                        <button
                            onClick={submitUtr}
                            className="mt-3 w-full bg-blue-600 text-white p-3 rounded"
                        >
                            Submit UTR
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <QRCodeCanvas
                        value={order.upiLink || ""}
                        size={220}
                        includeMargin
                    />
                    <div className="mt-2 text-xs break-all text-center">
                        {order.upiLink}
                    </div>
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">
                Note: One UPI transfer should match the order amount. UTR is
                used for manual reconciliation.
            </p>
        </div>
    );
}
