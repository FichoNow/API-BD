import { Request, Response } from "express";
import {
  PatchClockInModifiedBody,
  PatchClockInModifiedBodySchema,
} from "../../../../types/dto/user/fichajes/patch-clock-in-modified-body.js";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { updateClockInModifiedService } from "../../../../services/user/fichajes/update-clock-in-modified-service.js";

/**
 * Controller para corregir la hora de entrada de un fichaje (clock_in modificado).
 * Se usa cuando el usuario quiere ajustar manualmente su hora de entrada.
 *
 * Qué hace:
 * 1. Valida que el param `id` sea un entero positivo.
 * 2. Valida el body con el schema de Zod.
 * 3. Llama al service para actualizar el clock_in y marcar la modificación.
 * 4. Devuelve 200 con data null si todo es correcto.
 */
export async function patchClockInModifiedController(
  req: Request<{ id: string }, unknown, PatchClockInModifiedBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchClockInModifiedBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido.",
      400,
      "BAD_REQUEST",
    );
  }

  const userId = req.jwtClaims!.id;

  await updateClockInModifiedService(fichajeId, parsed.data, userId);

  res.status(200).json({ data: null });
}
