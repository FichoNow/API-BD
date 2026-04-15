import { Request, Response } from "express";
import {
  PatchFichajeBreakEndBody,
  PatchFichajeBreakEndBodySchema,
} from "../../../../../types/dto/user/fichajes/breaks/patch-fichaje-break-end-body.js";
import { BodyResponse, ResponseError } from "../../../../../types/express/response-type.js";
import { updateFichajeBreakEndService } from "../../../../../services/user/fichajes/breaks/update-fichaje-break-end-service.js";

/**
 * Controller para registrar la hora de fin de un descanso.
 *
 * Qué hace:
 * 1. Valida que los params `id` (fichaje) y `breakId` sean enteros positivos.
 * 2. Valida el body con el schema de Zod.
 * 3. Llama al service para cerrar el descanso.
 * 4. Devuelve 200 con data null si todo es correcto.
 */
export async function patchFichajeBreakEndController(
  req: Request<{ id: string; breakId: string }, unknown, PatchFichajeBreakEndBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);
  const breakId = Number(req.params.breakId);

  if (
    !Number.isInteger(fichajeId) || fichajeId <= 0 ||
    !Number.isInteger(breakId) || breakId <= 0
  ) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchFichajeBreakEndBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido.", 400, "BAD_REQUEST");
  }

  const userId = req.jwtClaims!.id;

  await updateFichajeBreakEndService(fichajeId, breakId, parsed.data, userId);

  res.status(200).json({ data: null });
}
