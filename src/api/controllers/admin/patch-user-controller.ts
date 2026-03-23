import { Request, Response } from "express";
import { updateUser } from "../../../services/admin/update-user-service.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { BodyResponse } from "../../../types/express/response-type.js";
import {
  UpdateUserBody,
  UpdateUserBodySchema,
} from "../../../types/dto/admin/update-user-body.js";
import { UpdateUserResponse } from "../../../types/dto/admin/update-user-response.js";

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

  const parsed = UpdateUserBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const adminCompanyId = req.jwtClaims!.company_id;

  const data = await updateUser(
    userId,
    parsed.data as UpdateUserBody,
    adminCompanyId,
  );

  return res.status(200).json({ data });
}
