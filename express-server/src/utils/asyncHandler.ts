import { ApiResponse } from "@/types/general";
import { Request, Response, NextFunction } from "express";

/*
 Middleware-specific properties (req.prop)
 Extend this when you need to add more shared props.
*/
export interface MiddlewareProps<
  ReqCookies extends Record<string, unknown> = {}
> {
  userId?: string;
  cookies: ReqCookies;
}

/*
 Extended Request type with intuitive generic order:
 Body → Params → Query → Cookies
*/
export interface RequestProps<
  ReqBody = unknown,
  ReqParams extends Record<string, unknown> = {},
  ReqQuery extends Record<string, unknown> = {},
  ReqCookies extends Record<string, unknown> = {}
> extends Omit<Request<ReqParams, any, ReqBody, ReqQuery>, "cookies">,
    MiddlewareProps<ReqCookies> {}

/*
 Controller function type
 Forces strong typing on both request and response.
*/
export type ControllerType<
  ReqBody = unknown,
  ReqParams extends Record<string, unknown> = {},
  ReqQuery extends Record<string, unknown> = {},
  ReqCookies extends Record<string, unknown> = {},
  ResBody = unknown
> = (
  req: RequestProps<ReqBody, ReqParams, ReqQuery, ReqCookies>,
  res: Response<ApiResponse<ResBody>>,
  next: NextFunction
) => Promise<Response<ApiResponse<ResBody>> | void>;

/*
 Async wrapper for controllers
 Eliminates try/catch boilerplate inside each controller.
*/
export const TryCatch =
  <
    ReqBody = unknown,
    ReqParams extends Record<string, unknown> = {},
    ReqQuery extends Record<string, unknown> = {},
    ReqCookies extends Record<string, unknown> = {},
    ResBody = unknown
  >(
    passedFunc: ControllerType<
      ReqBody,
      ReqParams,
      ReqQuery,
      ReqCookies,
      ResBody
    >
  ) =>
  async (
    req: RequestProps<ReqBody, ReqParams, ReqQuery, ReqCookies>,
    res: Response<ApiResponse<ResBody>>,
    next: NextFunction
  ) => {
    try {
      return await passedFunc(req, res, next);
    } catch (error) {
      next(error);
    }
  };

/*
# Example controller usage: 

type LoginReqBody = { email: string; password: string };
type LoginResData = { token: string };

export const loginController = TryCatch<LoginReqBody, {}, {}, {}, LoginResData>(
  async (req, res) => {
    const { email, password } = req.body;

    // ... controller logic (auth, db, etc.)

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token: "jwt_token_here" }
    });
  }
);

*/
