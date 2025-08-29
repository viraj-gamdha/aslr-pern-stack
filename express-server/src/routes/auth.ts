import {
  signinUser,
  signoutUser,
  refreshToken,
  signupUser,
  sendEmailOTP,
  verifyUser,
  verifyAndResetPassword,
} from "@/controllers/auth.js";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/signup", signupUser);
authRoutes.post("/request_otp", sendEmailOTP);
authRoutes.post("/verify_user", verifyUser);
authRoutes.post("/reset_password", verifyAndResetPassword)
authRoutes.post("/signin", signinUser);
authRoutes.get("/refresh_token", refreshToken);
authRoutes.post("/signout", signoutUser);

export { authRoutes };
