import { NextFunction, Request, Response } from "express";
import ErrorHandler from "@/utils/errorHandler.js";
import { envMode } from "@/app.js";

export const errorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  const response: {
    success: boolean;
    message: string;
    data?: ErrorHandler;
  } = {
    success: false,
    message: err.message,
  };

  if (envMode === "development") {
    response.data = err;
  }

  console.log("GLOBAL ERROR MIDDLEWARE:", err);

  return res.status(err.statusCode).json(response);
};
