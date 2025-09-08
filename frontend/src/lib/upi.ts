export function providerUri(
    method: string,
    upiLink: string | undefined,
    vpa: string,
    amount: number
) {
    const safeUpiLink = upiLink ?? ""; // fallback inside function
    const base = (() => {
        if (safeUpiLink) return safeUpiLink;

        const baseUri = `upi://pay?pa=${encodeURIComponent(
            vpa
        )}&pn=Merchant&am=${amount}&cu=INR`;

        switch (method.toLowerCase()) {
            case "phonepe":
                return `phonepe://pay?${baseUri.split("?")[1]}`;
            case "paytm":
                return `paytmmp://pay?${baseUri.split("?")[1]}`;
            case "google pay":
                return `tez://upi/pay?${baseUri.split("?")[1]}`;
            default:
                return baseUri;
        }
    })();

    if (method === "UPI") return safeUpiLink;
    const p = new URLSearchParams();
    p.set("pa", vpa);
    p.set("am", String(amount));
    p.set("cu", "INR");
    return `${base}?${p.toString()}`;
}
