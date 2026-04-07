import {
  findFichajeBreakById,
  updateFichajeBreakEndById,
} from "../../../../database/repositories/fichaje-break-repository.js";
import { verifyFichajeOwnership, toMinute } from "../../../../helpers/fichaje-helper.js";
import { PatchFichajeBreakEndBody } from "../../../../types/dto/user/fichajes/breaks/patch-fichaje-break-end-body.js";
import { ResponseError } from "../../../../types/express/response-type.js";

export async function updateFichajeBreakEndService(
  fichajeId: number,
  breakId: number,
  body: PatchFichajeBreakEndBody,
  userId: number,
): Promise<void> {
  const fichaje = await verifyFichajeOwnership(fichajeId, userId);

  const fichajeBreak = await findFichajeBreakById(breakId);

  if (!fichajeBreak || fichajeBreak.fichaje_id !== fichajeId) {
    throw new ResponseError("Descanso no encontrado.", 404, "BREAK_NOT_FOUND");
  }

  if (fichajeBreak.ended_at !== null) {
    throw new ResponseError("Este descanso ya está cerrado.", 409, "BREAK_ALREADY_CLOSED");
  }

  if (body.ended_at <= toMinute(fichajeBreak.started_at)) {
    throw new ResponseError(
      "La hora de fin no puede ser anterior o igual a la hora de inicio del descanso.",
      400,
      "BREAK_ENDED_AT_BEFORE_STARTED_AT",
    );
  }

  if (fichaje.clock_out !== null && body.ended_at > toMinute(fichaje.clock_out)) {
    throw new ResponseError(
      "La hora de fin del descanso no puede ser posterior a la salida del fichaje.",
      400,
      "BREAK_ENDED_AT_AFTER_CLOCK_OUT",
    );
  }

  await updateFichajeBreakEndById(breakId, { ended_at: body.ended_at });
}
