import bcrypt from "bcrypt";
import ErrorHandler from "./errorHandler";
import { emailRegex } from "./regex";
import { db } from "@/db/dbInit";
import { eq } from "drizzle-orm";
import { otp, user } from "@/db/schema/index.js";

export const verifyEmailOTP = async (
  email: string,
  emailOTP: string
): Promise<boolean> => {
  if (!email) {
    throw new ErrorHandler(400, "Please provide a valid email");
  }

  if (!emailRegex.test(email)) {
    throw new ErrorHandler(400, "Invalid email");
  }

  if (!emailOTP) {
    throw new ErrorHandler(400, "Please provide an OTP sent to email");
  }

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!existingUser) {
    throw new ErrorHandler(400, "No user found with given credentials");
  }

  const matchedOTPRecord = await db.query.otp.findFirst({
    where: eq(otp.email, existingUser.email),
  });

  if (!matchedOTPRecord) {
    throw new ErrorHandler(400, "No records found. Please request again.");
  }

  const { expiresAt, emailOtp: hashedOtpEmail } = matchedOTPRecord;

  if (expiresAt.getTime() < Date.now()) {
    await db.delete(otp).where(eq(otp.email, existingUser.email));
    throw new ErrorHandler(400, "OTP is expired. Please request again.");
  }

  const matchEmailOtp = await bcrypt.compare(emailOTP, hashedOtpEmail);

  if (!matchEmailOtp) {
    throw new ErrorHandler(400, "OTP is invalid. Please try again.");
  }

  return true;
};
