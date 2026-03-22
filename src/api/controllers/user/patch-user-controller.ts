import { Request, Response } from "express";
import { updateSelf } from "../../../services/user/update-self-service.js";
import { ResponseError, BodyResponse } from "../../../types/express/response-type.js";
import { UpdateSelfBody, UpdateSelfBodySchema } from "../../../types/dto/user/update-user-body.js";
import { UpdateSelfResponse } from "../../../types/dto/user/update-user-response.js";

/**
 * Controller del endpoint de actualización del propio perfil (PATCH /user/update).
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Extraer el ID del usuario autenticado desde el JWT.
 * 3. Extraer los datos a actualizar del body.
 * 4. Delegar la lógica al service `updateSelf`.
 * 5. Devolver la respuesta HTTP correspondiente según el resultado.
 */
export async function patchSelfController(
  req: Request<unknown, unknown, UpdateSelfBody>,
  res: Response<BodyResponse<UpdateSelfResponse>>,
) {
  const userId = req.jwtClaims!.id;

  const parsed = UpdateSelfBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("El cuerpo de la solicitud no puede estar vacío", 400, "BAD_REQUEST");
  }

  const data = await updateSelf(userId, parsed.data as UpdateSelfBody);

  if (!data) {
    throw new ResponseError("Usuario no encontrado", 404, "USER_NOT_FOUND");
  }

  return res.status(200).json({ data });
}
