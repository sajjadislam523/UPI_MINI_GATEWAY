export function buildUpiLink(params: {
    pa: string;
    pn?: string;
    am: number | string;
    tn?: string;
    tr?: string;
}) {
    const { pa, pn, am, tn, tr } = params;
    const search = new URLSearchParams();
    search.set("pa", pa);
    if (pn) search.set("pn", pn);
    search.set("am", Number(am).toFixed(2));
    search.set("cu", "INR");
    if (tn) search.set("tn", tn);
    if (tr) search.set("tr", tr);
    return `upi://pay?${search.toString()}`;
}

export function maskVpa(vpa: string) {
    const parts = vpa.split("@");
    if (parts.length !== 2) return vpa;
    const user = parts[0];
    const domain = parts[1];
    if ((user?.length ?? 0) <= 4) return `${user?.[0]}***@${domain}`;
    return `${user?.slice(0, 2)}***${user?.slice(-2)}@${domain}`;
}

export function isValidVpa(vpa: string) {
    return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(vpa);
}
