import { findFichajeById } from "../../database/repositories/fichaje-repository.js";
import {
  findFichajeEntryById,
  updateFichajeEntryStartById,
} from "../../database/repositories/fichaje-entry-repository.js";
import { PatchFichajeEntryStartBody } from "../../types/dto/user/patch-fichaje-entry-start-body.js";
import { ResponseError } from "../../types/express/response-type.js";

export async function updateFichajeEntryStartService(
  fichajeId: number,
  entryId: number,
  body: PatchFichajeEntryStartBody,
  userId: number,
): Promise<void> {
  const fichaje = await findFichajeById(fichajeId);

  if (!fichaje || fichaje.user_id !== userId) {
    throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
  }

  const entry = await findFichajeEntryById(entryId);

  if (!entry || entry.fichaje_id !== fichajeId) {
    throw new ResponseError("Entry no encontrada.", 404, "FICHAJE_ENTRY_NOT_FOUND");
  }

  const clockInMinute = new Date(Math.floor(fichaje.clock_in.getTime() / 60000) * 60000);
  if (body.started_at < clockInMinute) {
    throw new ResponseError(
      "La hora de inicio no puede ser anterior a la entrada del fichaje.",
      400,
      "ENTRY_STARTED_AT_BEFORE_CLOCK_IN",
    );
  }

  if (fichaje.clock_out !== null) {
    const clockOutMinute = new Date(Math.floor(fichaje.clock_out.getTime() / 60000) * 60000);
    if (body.started_at > clockOutMinute) {
      throw new ResponseError(
        "La hora de inicio no puede ser posterior a la salida del fichaje.",
        400,
        "ENTRY_STARTED_AT_AFTER_CLOCK_OUT",
      );
    }
  }

  if (entry.ended_at !== null) {
    const endedAtMinute = new Date(Math.floor(entry.ended_at.getTime() / 60000) * 60000);
    if (body.started_at > endedAtMinute) {
      throw new ResponseError(
        "La hora de inicio no puede ser posterior a la hora de fin.",
        400,
        "ENTRY_STARTED_AT_AFTER_ENDED_AT",
      );
    }
  }

  await updateFichajeEntryStartById(entryId, { started_at: body.started_at });
}
