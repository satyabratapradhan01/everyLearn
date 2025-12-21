import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true},
    password: { type: String},
    isVarified: {type: Boolean, default: false},

    otp: String,
    otpExpiry: Date
});

const User = mongoose.model("User", userSchema);
export default User;