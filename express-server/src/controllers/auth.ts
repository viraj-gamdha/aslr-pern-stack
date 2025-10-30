import { db } from "@/db/dbInit.js";
import { NewUser, otp, User, user } from "@/db/schema/index.js";
import { AuthJwtPayload } from "@/types/user";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import { generate4DigitOtp, hashPassword } from "@/utils/helpers.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { emailRegex, passwordRegex } from "@/utils/regex.js";
import { Resend } from "resend";
import { otpEmail } from "@/email-templates/otpEmail.js";
import { verifyEmailOTP } from "@/utils/auth.js";

// Constants
const ACCESS_TOKEN_EXPIRY = 60 * 1; // 15 minutes
const REFRESH_TOKEN_EXPIRY = 60 * 60 * 24 * 7; // 7 days

// Register user
export const signupUser = TryCatch<
  NewUser & { confirmPassword: string }, // ReqBody
  {}, // ReqParams
  {}, // ReqQueries
  {}, // ReqCookies
  null // Response
>(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name) {
    return next(new ErrorHandler(400, "Name is required!"));
  }

  if (!email) {
    return next(new ErrorHandler(400, "Email is required!"));
  }

  // Email format validation
  if (!emailRegex.test(email)) {
    return next(new ErrorHandler(400, "Invalid email format!"));
  }

  if (!password || !confirmPassword) {
    return next(new ErrorHandler(400, "Password is required!"));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler(400, "Passwords does not match!"));
  }

  if (!passwordRegex.test(confirmPassword)) {
    return next(
      new ErrorHandler(
        400,
        "Invalid password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character."
      )
    );
  }

  // Check for existing user
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });
  if (existingUser) {
    return next(
      new ErrorHandler(400, "User already exists. Please initiate Signin.")
    );
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(confirmPassword);
  await db.insert(user).values({
    name,
    email,
    password: hashedPassword,
    emailVerified: false,
  });

  // trigger send otp from frontend after successful
  return res.status(200).json({
    success: true,
    message: "Signup successful",
    data: null,
  });
});

// Login user
export const signinUser = TryCatch<
  { email: string; password: string }, // ReqBody
  {}, // ReqParams
  {}, // ReqQueries
  {}, // ReqCookies
  {
    id?: string;
    name?: string;
    email?: string;
    accessToken: string | null;
    emailVerified: boolean;
  } // Response
>(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  if (!foundUser) {
    return next(new ErrorHandler(403, "Invalid credentials"));
  }

  // Validate password
  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    return next(new ErrorHandler(400, "Invalid credentials"));
  }

  // strict verification before signin...
  if (!foundUser.emailVerified) {
    return res.status(200).json({
      success: true,
      message: "Email verification pending",
      data: {
        emailVerified: false,
        accessToken: null,
      },
    });
  }

  // Generate tokens
  const accessToken = jwt.sign(
    {
      userId: foundUser.id,
      email: foundUser.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    {
      userId: foundUser.id,
      email: foundUser.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  // Set refresh token cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: REFRESH_TOKEN_EXPIRY * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Welcome",
    data: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      accessToken: accessToken,
      emailVerified: foundUser.emailVerified,
    },
  });
});

// Send Verification OTP
export const sendEmailOTP = TryCatch<
  { email: string },
  {},
  {},
  {},
  { resendAfter: number }
>(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler(400, "Please provide a valid email"));
  }

  if (!emailRegex.test(email)) {
    return next(new ErrorHandler(400, "Invalid email"));
  }

  const findInDb = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!findInDb) {
    return next(
      new ErrorHandler(
        400,
        "No user exists with given credentials please initiate Signup."
      )
    );
  }

  // first we will limit the user to resend after 60 seconds
  const OTP = await db.query.otp.findFirst({ where: eq(otp.email, email) });

  if (OTP && OTP.resendEmailAt.getTime() > Date.now()) {
    const resendEmailAfter = Math.floor(
      (OTP.resendEmailAt.getTime() - Date.now()) / 1000
    );

    return next(
      new ErrorHandler(
        400,
        `Please try again after ${Math.abs(resendEmailAfter)} seconds`
      )
    );
  }

  // delete any existing otp
  await db.delete(otp).where(eq(otp.email, email));
  const generatedOtp = generate4DigitOtp();
  const hashedOtp = await bcrypt.hash(generatedOtp.toString(), 5);

  // set otp in db
  const [emailSentOTP] = await db
    .insert(otp)
    .values({
      email,
      emailOtp: hashedOtp,
      expiresAt: new Date(Date.now() + 600000), ///10 min
      resendEmailAt: new Date(Date.now() + 60000), /// 1 min
      updatedAt: new Date(),
    })
    .returning();

  // send email
  // const resend = new Resend(process.env.RESEND_API_KEY);

  // const resEmail = await resend.emails.send({
  //   from: `DOSLR <${process.env.RESEND_FROM_EMAIL}>`,
  //   to: emailSentOTP.email,
  //   subject: "Email verification",
  //   replyTo: process.env.RESEND_REPLY_TO,
  //   html: otpEmail(findInDb.name, generatedOtp),
  // });

  // if (resEmail.error) {
  //   await db.delete(otp).where(eq(otp.email, emailSentOTP.email));

  //   return next(
  //     new ErrorHandler(
  //       400,
  //       "Something went wrong! please try to reach us or try again later."
  //     )
  //   );
  // }

  console.log("OTP is:", generatedOtp);

  // for showing time
  const resendEmailAfter =
    Math.ceil((emailSentOTP.resendEmailAt.getTime() - Date.now()) / 1000) || 60;

  return res.status(200).json({
    success: true,
    message: "Verification email OTP sent successfully",
    data: { resendAfter: resendEmailAfter },
  });
});

// Verification after Signup
export const verifyUser = TryCatch<{ email: string; emailOTP: string }>(
  async (req, res, next) => {
    const isVerified = await verifyEmailOTP(
      req.body?.email,
      req.body?.emailOTP
    );

    if (!isVerified) {
      return next(new ErrorHandler(400, "Something went wrong"));
    }

    // set emailVerified status (use must exists in db before sending any otp)
    await db
      .update(user)
      .set({ emailVerified: true })
      .where(eq(user.email, req.body?.email));

    // delete record from otp
    await db.delete(otp).where(eq(otp.email, req.body?.email));

    return res.status(200).json({
      success: true,
      message: "Verification successful",
      data: null,
    });
  }
);

// Forgot password reset
export const verifyAndResetPassword = TryCatch<{
  email: string;
  emailOTP: string;
  password: string;
  confirmPassword: string;
}>(async (req, res, next) => {
  const isVerified = await verifyEmailOTP(req.body?.email, req.body?.emailOTP);

  if (!isVerified) {
    return next(new ErrorHandler(400, "Something went wrong"));
  }

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandler(400, "Password is required"));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler(400, "Passwords doesn't match"));
  }

  if (!passwordRegex.test(confirmPassword)) {
    return next(
      new ErrorHandler(
        400,
        "Invalid password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character."
      )
    );
  }

  // verified, set new password
  const hashedPassword = await hashPassword(confirmPassword);

  await db
    .update(user)
    .set({ password: hashedPassword })
    .where(eq(user.email, req.body?.email));

  // delete record from otp
  await db.delete(otp).where(eq(otp.email, req.body?.email));

  return res.status(200).json({
    success: true,
    message: `Your password has been reset successfully`,
    data: null,
  });
});

// Refresh access token
// All 403 in case of errors
export const refreshToken = TryCatch<
  {}, // ReqBody
  {}, // ReqParams
  {}, // ReqQueries
  { refresh_token: string }, // ReqCookies
  Partial<User> & { accessToken: string } // Response
>(async (req, res, next) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return next(new ErrorHandler(403, "Forbidden!"));
  }

  let payload: AuthJwtPayload;
  try {
    payload = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!
    ) as AuthJwtPayload;
  } catch (err) {
    return next(new ErrorHandler(403, "Forbidden!"));
  }

  if (!payload || !payload.userId) {
    return next(new ErrorHandler(403, "Forbidden!"));
  }

  // Find user
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, payload.userId))
    .limit(1);
  if (!user) {
    return next(new ErrorHandler(403, "Forbidden!"));
  }

  // Generate new access token
  const newAccessToken = jwt.sign(
    {
      userId: foundUser.id,
      email: foundUser.email,
    },
    process.env.JWT_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  return res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    data: {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      accessToken: newAccessToken,
    },
  });
});

// Logout user
export const signoutUser = TryCatch<
  {}, // ReqBody
  {}, // ReqParams
  {}, // ReqQueries
  {}, // ReqCookies
  null // Response
>(async (req, res) => {
  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    message: "Signout successful",
    data: null,
  });
});
