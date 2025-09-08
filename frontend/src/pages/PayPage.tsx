import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import CopyButton from "../components/CopyButton";
import PaymentIcon from "../components/PaymentIcon";
import { providerUri } from "../lib/upi";
import type { OrderPublic } from "../types/types";

const methods = ["PhonePe", "Paytm", "Google Pay", "UPI"];

export default function PayPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const [order, setOrder] = useState<OrderPublic | null>(null);
    const [utr, setUtr] = useState("");
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // display-only timer

    const api = import.meta.env.VITE_API_URL;

    // Fetch order details
    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return;
            try {
                const r = await axios.get<OrderPublic>(
                    `${api}/api/orders/${orderId}`
                );
                setOrder(r.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text:
                            err.response?.data?.message ||
                            "Error fetching order",
                        confirmButtonColor: "#2563eb",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Unknown Error",
                        text: "Something went wrong while fetching order details.",
                        confirmButtonColor: "#2563eb",
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, api]);

    // Countdown timer (only display)
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    if (loading) return <div className="text-center py-10">Loading…</div>;
    if (!order) return <div className="text-center py-10">Order not found</div>;

    // Safely parse the full VPA from the UPI link
    const fullVpa = (() => {
        if (order.upiLink) {
            try {
                const url = new URL(order.upiLink);
                return url.searchParams.get("pa") || "";
            } catch (e) {
                console.error("Could not parse UPI link:", order.upiLink, e);
            }
        }
        return order.maskedVpa.replace(/\*+/g, "");
    })();

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    const onPay = (method: string) => {
        if (!order?.upiLink) {
            Swal.fire({
                icon: "warning",
                title: "UPI Link Missing",
                text: "UPI link not available for this order.",
                confirmButtonColor: "#2563eb",
            });
            return;
        }
        const uri = providerUri(
            method,
            order.upiLink,
            order.maskedVpa.replace(/\*+/g, ""),
            order.amount
        );

        window.location.href = uri;
    };

    const submitUtr = async () => {
        if (!orderId) return;
        if (!utr.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Missing UTR",
                text: "Please enter a valid UTR number before submitting.",
                confirmButtonColor: "#2563eb",
            });
            return;
        }
        try {
            await axios.post(`${api}/api/orders/${orderId}/utr`, { utr });
            Swal.fire({
                icon: "success",
                title: "UTR Submitted",
                text: "Your payment UTR has been submitted successfully.",
                confirmButtonColor: "#2563eb",
            });
            setUtr("");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                Swal.fire({
                    icon: "error",
                    title: "Submission Failed",
                    text: err.response?.data?.message || "Error submitting UTR",
                    confirmButtonColor: "#dc2626",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Unknown Error",
                    text: "Something went wrong while submitting UTR.",
                    confirmButtonColor: "#dc2626",
                });
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow p-6">
            {/* Header with Timer */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <p className="text-gray-600 text-sm">
                        Order will be closed in:
                    </p>
                    <p className="text-xl font-mono text-blue-600">
                        {minutes}:{seconds}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-gray-600 text-sm">Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                        ₹ {order.amount}
                    </p>
                    <CopyButton text={String(order.amount)} label="COPY" />
                </div>
            </div>

            {/* VPA Section */}
            <div className="mb-4">
                <p className="text-gray-600 text-sm">VPA/UPI</p>
                <p className="font-mono text-lg">{order.maskedVpa}</p>
                <CopyButton text={fullVpa} label="COPY" />
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col gap-3 mb-6">
                {methods.map((m) => (
                    <button
                        key={m}
                        onClick={() => onPay(m)}
                        className="border rounded-xl p-4 text-center hover:bg-blue-50 flex items-center justify-center gap-3"
                    >
                        <PaymentIcon method={m} />
                        <span className="font-medium">{m}</span>
                    </button>
                ))}
            </div>

            {/* UTR Input */}
            <div className="mb-6">
                <label className="block mb-1 text-gray-700">
                    Fill the UTR number after you complete payment:
                </label>
                <input
                    className="w-full p-3 border rounded mb-3"
                    placeholder="Enter UTR number"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                />
                <button
                    onClick={submitUtr}
                    className="w-full bg-blue-600 text-white rounded p-3 font-semibold hover:bg-blue-700"
                >
                    Submit UTR
                </button>
            </div>

            {/* Notice */}
            <p className="text-xs text-red-600 mt-4">
                Notice: One UPI can only transfer money once. Don't change the
                payment amount — otherwise the order cannot be closed.
            </p>
        </div>
    );
}
