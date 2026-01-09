import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otp = crypto.randomInt(100000, 1000000).toString();

  const user = await User.create({
    email,
    password: hashedPassword,
    otp,
    otpExpiry: Date.now() + 5 * 60 * 1000,
  });

  await sendEmail(email, "Verify Email", `Your OTP is ${otp}`);

  res.json({ message: "OTP sent to email" });
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email ans otp reuired" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (otp !== user.otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVarified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  res.json({ message: "Email verified successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.isVarified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "wrog password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.send({ token });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "OTP sent if account exists" });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmail(email, "Reset password otp", `your otp is ${otp}`);

  res.send({ message: "otp send" });
});

router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (!email || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
});

router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; 
    await user.save();

    await sendEmail(email, "Resend OTP", `Your new OTP is ${otp}`);

    res.json({ message: "New OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: "Failed to resend OTP" });
  }
});


export default router;
