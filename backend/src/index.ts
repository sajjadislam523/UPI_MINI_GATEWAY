import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import dashboardRouter from "./routes/dashboard";
import ordersRouter from "./routes/order";
import usersRouter from "./routes/users";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allow frontend from LAN (PC + Phone)
const allowedOrigin = process.env.APP_BASE_URL || "*";
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow no-origin requests (mobile browsers sometimes send no origin)
            if (!origin || allowedOrigin === "*" || origin === allowedOrigin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// ✅ API Routes
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);

// ✅ Parse PORT as number
const PORT = parseInt(process.env.PORT || "4000", 10);

// ✅ Connect to DB and listen on all network interfaces
mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => {
        console.log("✅ Mongo connected");
    })
    .catch((err) => {
        console.error("❌ DB connect error:", err);
        process.exit(1);
    });

export default app;
