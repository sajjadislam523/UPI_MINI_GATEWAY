import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import ordersRouter from "./routes/order";

dotenv.config();
const app = express();
app.use(express.json());

const allowedOrigin = process.env.APP_BASE_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin }));

app.use("/api/orders", ordersRouter);

const PORT = process.env.PORT || 4000;
mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => {
        console.log("Mongo connected");
        app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    })
    .catch((err) => {
        console.error("DB connect error:", err);
        process.exit(1);
    });
