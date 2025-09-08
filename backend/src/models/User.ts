import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password?: string;
    role: "admin" | "user";
}

const UserSchema = new mongoose.Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

export default mongoose.model<IUser>("User", UserSchema);
