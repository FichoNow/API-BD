import { Request, Response } from "express";
import { ResponseError } from "../../../types/express/response-type.js";
import { BodyResponse } from "../../../types/express/response-type.js";
import { PostRefreshResponse } from "../../../types/dto/auth/post-refresh-response.js";
import {
  PostRefreshBody,
  PostRefreshBodySchema,
} from "../../../types/dto/auth/post-refresh-body.js";
import { refreshUser } from "../../../services/auth/refresh-service.js";

/**
 * Controller del endpoint de refresh.
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Extraer y validar el refresh token del body.
 * 3. Delegar la lógica de refresco al service `refreshUser`.
 * 4. Devolver la respuesta HTTP correspondiente según el resultado.
 */
export async function refreshController(
  req: Request<unknown, unknown, PostRefreshBody>,
  res: Response<BodyResponse<PostRefreshResponse>>,
) {
  const parsed = PostRefreshBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await refreshUser(parsed.data as PostRefreshBody);

  return res.status(200).json({ data });
}
