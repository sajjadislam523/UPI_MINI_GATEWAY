import { Router } from "express";
import { admin, protect } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

// Get all users (admin only)
router.get("/", protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

// Create a new user (admin only)
router.post("/", protect, admin, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ message: "username and password required" });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "username already exists" });
        }
        const user = await User.create({
            username,
            password,
            role: role || "user",
        });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

// Delete a user (admin only)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        res.json({ message: "user removed" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "server error" });
    }
});

export default router;
