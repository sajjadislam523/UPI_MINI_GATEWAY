export function providerUri(
    method: string,
    upiLink: string,
    vpa: string,
    amount: number
) {
    // Build the base parameters
    const params = new URLSearchParams();
    params.set("pa", vpa);
    params.set("pn", "Merchant");
    params.set("am", String(amount));
    params.set("cu", "INR");

    // If a custom upiLink is passed, return it directly
    if (upiLink) return upiLink;

    let scheme = `upi://pay?${params.toString()}`;

    switch (method.toLowerCase()) {
        case "phonepe":
            scheme = `phonepe://pay?${params.toString()}`;
            break;
        case "paytm":
            scheme = `paytmmp://pay?${params.toString()}`;
            break;
        case "google pay":
            scheme = `tez://upi/pay?${params.toString()}`;
            break;
    }

    return scheme;
}
