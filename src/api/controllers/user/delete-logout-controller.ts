import { Request, Response } from "express";
import { logoutUser } from "../../../services/auth/logout-service.js";
import { BodyResponse } from "../../../types/express/response-type.js";

export async function logoutController(
  req: Request,
  res: Response<BodyResponse<null>>,
) {
  await logoutUser(req.jwtClaims!.id);

  return res.status(200).json({ data: null });
}
