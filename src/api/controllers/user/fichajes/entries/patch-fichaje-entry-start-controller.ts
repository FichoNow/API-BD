import { Request, Response } from "express";
import {
  PatchFichajeEntryStartBody,
  PatchFichajeEntryStartBodySchema,
} from "../../../../../types/dto/user/fichajes/entries/patch-fichaje-entry-start-body.js";
import { BodyResponse, ResponseError } from "../../../../../types/express/response-type.js";
import { updateFichajeEntryStartService } from "../../../../../services/user/fichajes/entries/update-fichaje-entry-start-service.js";

/**
 * Controller para modificar la hora de inicio de una entry de proyecto.
 *
 * Qué hace:
 * 1. Valida que los params `id` (fichaje) y `entryId` sean enteros positivos.
 * 2. Valida el body con el schema de Zod.
 * 3. Llama al service para actualizar la hora de inicio de la entry.
 * 4. Devuelve 200 con data null si todo es correcto.
 */
export async function patchFichajeEntryStartController(
  req: Request<{ id: string; entryId: string }, unknown, PatchFichajeEntryStartBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);
  const entryId = Number(req.params.entryId);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0 || !Number.isInteger(entryId) || entryId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchFichajeEntryStartBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido.", 400, "BAD_REQUEST");
  }

  const userId = req.jwtClaims!.id;

  await updateFichajeEntryStartService(fichajeId, entryId, parsed.data, userId);

  res.status(200).json({ data: null });
}
