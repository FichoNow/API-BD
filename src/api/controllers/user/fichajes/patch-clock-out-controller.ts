import { Request, Response } from "express";
import {
  PatchClockOutBody,
  PatchClockOutBodySchema,
} from "../../../../types/dto/user/fichajes/patch-clock-out-body.js";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { updateClockOutService } from "../../../../services/user/fichajes/update-clock-out-service.js";

/**
 * Controller para registrar la hora de salida de un fichaje (clock_out normal).
 * Se llama cuando el usuario pulsa "parar fichaje" desde la app.
 *
 * Qué hace:
 * 1. Valida que el param `id` sea un entero positivo.
 * 2. Valida el body con el schema de Zod.
 * 3. Llama al service para guardar el clock_out.
 * 4. Devuelve 200 con data null si todo es correcto.
 */
export async function patchClockOutController(
  req: Request<{ id: string }, unknown, PatchClockOutBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchClockOutBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido.",
      400,
      "BAD_REQUEST",
    );
  }

  const userId = req.jwtClaims!.id;

  await updateClockOutService(fichajeId, parsed.data, userId);

  res.status(200).json({ data: null });
}
