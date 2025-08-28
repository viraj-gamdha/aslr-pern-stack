import bcrypt from "bcrypt";

// Helper function to hash password
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export const generate4DigitOtp = () => {
  ///4 DIGIT OTP
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};