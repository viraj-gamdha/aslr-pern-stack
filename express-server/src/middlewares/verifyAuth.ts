import { db } from "@/db/dbInit.js";
import { user } from "@/db/schema/index.js";
import { AuthJwtPayload } from "@/types/user";
import { TryCatch } from "@/utils/asyncHandler.js";
import ErrorHandler from "@/utils/errorHandler.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const verifyAuth = TryCatch(async (req, res, next) => {
  ///Look if there are authorization header we can set either one but this is a good practice
  const authHeader = req.headers.authorization || req.headers.Authorization;

  ///header has Bearer token
  if (typeof authHeader === "string" && authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    //token is after the space second item of the string
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) return next(new ErrorHandler(401, "Unauthorized!"));

      // This data will passed to next
      const { userId } = decoded as AuthJwtPayload;

      // verify if user exists
      const existingUser = db.query.user.findFirst({
        where: eq(user.id, userId),
      });

      if (!existingUser) {
        return next(new ErrorHandler(404, "User not found!"));
      }

      req.userId = userId;
      next();
    });
  } else {
    return next(new ErrorHandler(401, "Unauthorized. Token required."));
  }
});
