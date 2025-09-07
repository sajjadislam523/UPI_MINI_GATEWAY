export function providerUri(
    method: string,
    upiLink: string,
    vpa: string,
    amount: number
) {
    const base = (() => {
        if (method === "PhonePe") return `phonepe://pay`;
        if (method === "Google Pay") return `tez://upi/pay`;
        if (method === "Paytm") return `paytmmp://pay`;
        return `upi://pay`;
    })();
    if (method === "UPI") return upiLink;
    const p = new URLSearchParams();
    p.set("pa", vpa);
    p.set("am", String(amount));
    p.set("cu", "INR");
    return `${base}?${p.toString()}`;
}
