import { Request, Response } from "express";
import { logoutUser } from "../../../../services/user/profile/logout-service.js";
import { BodyResponse } from "../../../../types/express/response-type.js";

/**
 * Controller para cerrar la sesión del usuario autenticado.
 * Elimina el refresh token de la base de datos, invalidando la sesión.
 *
 * Qué hace:
 * 1. Obtiene el id del usuario autenticado desde el JWT.
 * 2. Llama al service para borrar el refresh token.
 * 3. Devuelve 200 con data null.
 */
export async function logoutController(
  req: Request,
  res: Response<BodyResponse<null>>,
) {
  await logoutUser(req.jwtClaims!.id);

  return res.status(200).json({ data: null });
}
