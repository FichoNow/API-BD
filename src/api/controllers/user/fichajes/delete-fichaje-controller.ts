import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { deleteFichajeService } from "../../../../services/user/fichajes/delete-fichaje-service.js";

/**
 * Controller para eliminar un fichaje del usuario autenticado.
 *
 * Qué hace:
 * 1. Valida que el param `id` sea un entero positivo.
 * 2. Obtiene el id del usuario autenticado desde el JWT.
 * 3. Llama al service para eliminar el fichaje (comprueba que pertenece al usuario).
 * 4. Devuelve 200 con data null si la eliminación es correcta.
 */
export async function deleteFichajeController(
  req: Request<{ id: string }>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const userId = req.jwtClaims!.id;

  await deleteFichajeService(fichajeId, userId);

  res.status(200).json({ data: null });
}
