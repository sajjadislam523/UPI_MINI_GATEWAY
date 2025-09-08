import { Router } from "express";
import { admin, protect } from "../middleware/auth";
import Order from "../models/Order";
import User from "../models/User";

const router = Router();

router.get("/stats", protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const userOrders = await Order.aggregate([
            { $group: { _id: "$user", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            { $project: { _id: 0, username: "$user.username", count: 1 } },
        ]);

        res.json({
            totalUsers,
            totalOrders,
            userOrders,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

export default router;
