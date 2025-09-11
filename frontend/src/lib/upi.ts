export function providerUri(
    method: string,
    upiLink: string | undefined,
    vpa: string,
    amount: number
): string {
    // If a full upiLink is provided, prioritize it for all methods.
    if (upiLink) {
        return upiLink;
    }

    // Base UPI parameters
    const params = new URLSearchParams({
        pa: vpa,
        pn: "Merchant", // Assuming a generic merchant name
        am: String(amount),
        cu: "INR",
    });

    // Determine the base URI scheme for the selected app
    let baseUri: string;
    switch (method) {
        case "PhonePe":
            baseUri = "phonepe://pay";
            break;
        case "Paytm":
            baseUri = "paytmmp://pay";
            break;
        case "Google Pay":
            baseUri = "tez://upi/pay";
            break;
        default:
            // Generic UPI link
            baseUri = "upi://pay";
            break;
    }

    // Combine base URI and parameters
    return `${baseUri}?${params.toString()}`;
}
