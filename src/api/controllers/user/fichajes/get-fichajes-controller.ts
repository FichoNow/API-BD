import { Request, Response } from "express";
import { BodyResponse } from "../../../../types/express/response-type.js";
import { getFichajesService } from "../../../../services/user/fichajes/get-fichajes-service.js";
import { GetFichajesResponse } from "../../../../types/dto/user/fichajes/get-fichajes-response.js";

/**
 * Controller para obtener los fichajes recientes del usuario autenticado.
 *
 * Qué hace:
 * 1. Obtiene el id del usuario autenticado desde el JWT.
 * 2. Llama al service para recuperar la lista de fichajes (limitada a los últimos 20).
 * 3. Devuelve la lista en la respuesta.
 */
export async function getFichajesController(
  req: Request,
  res: Response<BodyResponse<GetFichajesResponse>>,
) {
  const userId = req.jwtClaims!.id;

  const data = await getFichajesService(userId);

  res.status(200).json({ data });
}
