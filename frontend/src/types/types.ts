export interface OrderPublic {
    orderId: string;
    amount: number;
    merchantName?: string;
    maskedVpa: string;
    upiLink?: string;
    status: string;
    expiresAt?: string;
}
export interface CreateOrderResp {
    orderId: string;
    payPageUrl: string;
    upiLink: string;
}
