import { Request, Response, Router } from "express";
import rateLimit from "express-rate-limit";
import { customAlphabet } from "nanoid";
import { admin, AuthRequest, protect } from "../middleware/auth";
import Order from "../models/Order";
import { buildUpiLink, isValidVpa, maskVpa } from "../utils/upi";

const router = Router();
const nano = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
const utrLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5 });

router.post("/", protect, async (req: AuthRequest, res: Response) => {
    try {
        const {
            amount,
            vpa,
            merchantName,
            note,
            expiresInSec = 5400,
        } = req.body;
        if (!amount || !vpa)
            return res.status(400).json({ message: "amount and vpa required" });
        if (!isValidVpa(vpa))
            return res.status(400).json({ message: "invalid VPA format" });

        const orderId = nano();
        const upiLink = buildUpiLink({
            pa: vpa,
            pn: merchantName || "Merchant",
            am: amount,
            tn: note,
            tr: orderId,
        });
        const expiresAt = new Date(Date.now() + Number(expiresInSec) * 1000);

        const order = await Order.create({
            user: req.user?.userId,
            orderId,
            amount,
            vpa,
            merchantName,
            note,
            upiLink,
            expiresAt,
        });
        return res.json({
            orderId,
            payPageUrl: `${process.env.APP_BASE_URL}/pay/${orderId}`,
            upiLink,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "server error" });
    }
});

router.get("/:orderId", async (req: Request, res: Response) => {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    if (!order) return res.status(404).json({ message: "order not found" });
    return res.json({
        orderId: order.orderId,
        amount: order.amount,
        merchantName: order.merchantName,
        maskedVpa: maskVpa(order.vpa),
        upiLink: order.upiLink,
        status: order.status,
        expiresAt: order.expiresAt,
    });
});

router.post(
    "/:orderId/utr",
    utrLimiter,
    async (req: Request, res: Response) => {
        try {
            const { utr } = req.body;
            if (!utr || !/^[0-9A-Za-z]{6,32}$/.test(utr))
                return res.status(400).json({ message: "invalid UTR" });
            const order = await Order.findOne({ orderId: req.params.orderId });
            if (!order)
                return res.status(404).json({ message: "order not found" });
            if (order.expiresAt && new Date() > order.expiresAt) {
                order.status = "EXPIRED";
                await order.save();
                return res.status(400).json({ message: "order expired" });
            }
            order.utr = utr;
            order.status = "SUBMITTED";
            await order.save();
            return res.json({ message: "UTR received" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "server error" });
        }
    }
);

// admin verify (in prod protect with auth)
router.post("/:orderId/verify", protect, admin, async (req, res) => {
    const order = await Order.findOneAndUpdate(
        { orderId: req.params.orderId },
        { status: "VERIFIED" },
        { new: true }
    );
    if (!order) return res.status(404).json({ message: "not found" });
    return res.json({ message: "verified" });
});

export default router;
