import {
  signinUser,
  signoutUser,
  refreshToken,
  signupUser,
  sendEmailOTP,
  verifyOTP,
} from "@/controllers/auth.js";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/signup", signupUser);

// OTP verification
authRoutes.post("/request_otp", sendEmailOTP);
authRoutes.post("/verify_otp", verifyOTP);

authRoutes.post("/signin", signinUser);
authRoutes.get("/refresh_token", refreshToken);
authRoutes.post("/signout", signoutUser);

export { authRoutes };
