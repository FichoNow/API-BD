import { Request, Response } from "express";
import { updateUser } from "../../../services/update-user-service.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { BodyResponse } from "../../../types/express/response-type.js";
import { UpdateUserBody } from "../../../types/dto/endpoints/admin/update-user-body.js";
import { UpdateUserResponse } from "../../../types/dto/endpoints/admin/update-user-response.js";

/**
 * Controller del endpoint de actualización de usuario (PATCH /admin/user/:id).
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Extraer y validar el ID del usuario desde los parámetros de la ruta.
 * 3. Extraer los datos a actualizar del body.
 * 4. Delegar la lógica al service `updateUser`.
 * 5. Devolver la respuesta HTTP correspondiente según el resultado.
 */
export async function patchUserController(
  req: Request<{ id: string }, unknown, UpdateUserBody>,
  res: Response<BodyResponse<UpdateUserResponse>>,
) {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new ResponseError("ID de usuario no válido", 400, "INVALID_USER_ID");
  }

  const body = req.body;

  if (!body || Object.keys(body).length === 0) {
    throw new ResponseError(
      "El cuerpo de la solicitud no puede estar vacío",
      400,
      "BAD_REQUEST",
    );
  }

  const adminCompanyId = req.jwtClaims!.companyId;

  const data = await updateUser(userId, body, adminCompanyId);

  if (!data) {
    throw new ResponseError("Usuario no encontrado", 404, "USER_NOT_FOUND");
  }

  return res.status(200).json({ success: true, data });
}
