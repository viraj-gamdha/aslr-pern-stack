import { db } from "@/db/dbInit.js";
import { NewUser, user } from "@/db/schema/index.js";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import { hashPassword } from "@/utils/helpers";
import { and, eq } from "drizzle-orm";

// Update user details
export const updateUserDetail = TryCatch<
  Partial<NewUser>,
  {},
  {},
  {},
  Partial<NewUser>
>(async (req, res, next) => {
  const userId = req.userId as string;
  const name = req.body?.name;
  const email = req.body?.email;
  const password = req.body?.password;

  // Prepare update data
  const updateData: Partial<NewUser> = {
    updatedAt: new Date(),
  };

  if (name) updateData.name = name;
  if (email) {
    // Check if email is already taken
    const existingEmail = await db
      .select({ id: user.id })
      .from(user)
      .where(and(eq(user.email, email), eq(user.id, userId)))
      .then((result) => result[0]);
    if (existingEmail && existingEmail.id !== userId) {
      return next(new ErrorHandler(400, "Email already exists!"));
    }

    updateData.email = email;
  }

  if (password) {
    // Hash password
    const hashedPassword = await hashPassword(password);
    updateData.password = hashedPassword;
  }

  if (Object.keys(updateData).length === 1) {
    // Only updatedAt
    return next(new ErrorHandler(400, "No valid fields provided for update"));
  }

  const [updatedUser] = await db
    .update(user)
    .set(updateData)
    .where(eq(user.id, userId))
    .returning();

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  });
});

export const test = TryCatch(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    data: null,
    message: "success",
  });
});

// Delete a user
export const deleteUser = TryCatch(async (req, res, next) => {
  const userId = req.userId as string;

  // Delete user (cascades to projects and tasks due to schema constraints)
  await db.delete(user).where(eq(user.id, userId));

  // clear session
  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    success: true,
    data: null,
    message: "User deleted successfully",
  });
});
