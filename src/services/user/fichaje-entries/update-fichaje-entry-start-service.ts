import {
  findFichajeEntryById,
  updateFichajeEntryStartById,
} from "../../../database/repositories/fichaje-entry-repository.js";
import { verifyFichajeOwnership, toMinute } from "../../../helpers/fichaje-helper.js";
import { PatchFichajeEntryStartBody } from "../../../types/dto/user/fichaje-entries/patch-fichaje-entry-start-body.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function updateFichajeEntryStartService(
  fichajeId: number,
  entryId: number,
  body: PatchFichajeEntryStartBody,
  userId: number,
): Promise<void> {
  const fichaje = await verifyFichajeOwnership(fichajeId, userId);

  const entry = await findFichajeEntryById(entryId);

  if (!entry || entry.fichaje_id !== fichajeId) {
    throw new ResponseError("Entry no encontrada.", 404, "FICHAJE_ENTRY_NOT_FOUND");
  }

  if (body.started_at < toMinute(fichaje.clock_in)) {
    throw new ResponseError(
      "La hora de inicio no puede ser anterior a la entrada del fichaje.",
      400,
      "ENTRY_STARTED_AT_BEFORE_CLOCK_IN",
    );
  }

  if (fichaje.clock_out !== null && body.started_at > toMinute(fichaje.clock_out)) {
    throw new ResponseError(
      "La hora de inicio no puede ser posterior a la salida del fichaje.",
      400,
      "ENTRY_STARTED_AT_AFTER_CLOCK_OUT",
    );
  }

  if (entry.ended_at !== null && body.started_at > toMinute(entry.ended_at)) {
    throw new ResponseError(
      "La hora de inicio no puede ser posterior a la hora de fin.",
      400,
      "ENTRY_STARTED_AT_AFTER_ENDED_AT",
    );
  }

  await updateFichajeEntryStartById(entryId, { started_at: body.started_at });
}
