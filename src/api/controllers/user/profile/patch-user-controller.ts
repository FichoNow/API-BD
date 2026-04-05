import { Request, Response } from "express";
import { updateSelf } from "../../../../services/user/profile/update-self-service.js";
import {
  ResponseError,
  BodyResponse,
} from "../../../../types/express/response-type.js";
import {
  PatchSelfBody,
  PatchSelfBodySchema,
} from "../../../../types/dto/user/profile/patch-self-body.js";
import { PatchSelfResponse } from "../../../../types/dto/user/profile/patch-self-response.js";

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
  req: Request<unknown, unknown, PatchSelfBody>,
  res: Response<BodyResponse<PatchSelfResponse>>,
) {
  const userId = req.jwtClaims!.id;

  const parsed = PatchSelfBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await updateSelf(userId, parsed.data as PatchSelfBody);

  return res.status(200).json({ data });
}
