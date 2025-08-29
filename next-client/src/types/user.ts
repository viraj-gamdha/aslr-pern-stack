import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

// Base schema
export const userInfoSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    email: z.email("Valid email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(passwordRegex, {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      }),
    confirmPassword: z.string(),
    emailVerified: z.boolean().optional().nullable(),
    accessToken: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UserInfo = z.infer<typeof userInfoSchema>;

// Signin / Signup
export const signinFormSchema = userInfoSchema.pick({
  email: true,
  password: true,
});

export type SigninFormInputs = z.infer<typeof signinFormSchema>;

export const signupSchema = userInfoSchema
  .omit({
    id: true,
    accessToken: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupFormInputs = z.infer<typeof signupSchema>;

// Forgot password and reset
export const sendOTPSchema = userInfoSchema.pick({
  email: true,
});

export type SendOTPInputs = z.infer<typeof sendOTPSchema>;

export const resetPassSchema = userInfoSchema
  .pick({
    email: true,
    password: true,
    confirmPassword: true,
  })
  .extend({
    emailOTP: z.string().regex(/^\d{4}$/, {
      message: "OTP must be exactly 4 digits",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
  
export type ResetPassInputs = z.infer<typeof resetPassSchema>;

export const verifyEmailOTPSchema = resetPassSchema.pick({
  email: true,
  emailOTP: true,
});

export type VerifyEmailOTPInputs = z.infer<typeof verifyEmailOTPSchema>;

// User data update
export const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Valid email is required"),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 8,
      "Password must be at least 8 characters if provided"
    ),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
