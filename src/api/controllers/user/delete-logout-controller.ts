import { Request, Response } from "express";
import { logoutUser } from "../../../services/auth/logout-service.js";
import {
  ResponseError,
  BodyResponse,
} from "../../../types/express/response-type.js";
import {
  PostRefreshBody,
  PostRefreshBodySchema,
} from "../../../types/dto/auth/post-refresh-body.js";

export async function logoutController(
  req: Request<unknown, unknown, PostRefreshBody>,
  res: Response<BodyResponse<null>>,
) {
  const parsed = PostRefreshBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  await logoutUser(parsed.data.refreshToken);

  return res.status(200).json({ data: null });
}
