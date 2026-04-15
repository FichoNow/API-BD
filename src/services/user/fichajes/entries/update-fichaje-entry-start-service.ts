import {
  findFichajeEntryById,
  updateFichajeEntryStartById,
} from "../../../../database/repositories/fichajes/fichaje-entry-repository.js";
import { startOfMinute } from "date-fns";
import { verifyFichajeOwnership } from "../../../../helpers/fichaje-helper.js";
import { PatchFichajeEntryStartBody } from "../../../../types/dto/user/fichajes/entries/patch-fichaje-entry-start-body.js";
import { ResponseError } from "../../../../types/express/response-type.js";

/**
 * Lógica de negocio para modificar la hora de inicio de una entry de proyecto.
 * Verifica que el fichaje pertenece al usuario, que la entry existe dentro de ese
 * fichaje y que la nueva hora de inicio es coherente (no anterior al clock_in del
 * fichaje, no posterior al clock_out ni a la hora de fin de la propia entry).
 *
 * @param fichajeId ID del fichaje al que pertenece la entry.
 * @param entryId ID de la entry a modificar.
 * @param body Cuerpo de la petición con la nueva hora de inicio.
 * @param userId ID del usuario autenticado.
 */
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

  if (body.started_at < startOfMinute(fichaje.clock_in)) {
    throw new ResponseError(
      "La hora de inicio no puede ser anterior a la entrada del fichaje.",
      400,
      "ENTRY_STARTED_AT_BEFORE_CLOCK_IN",
    );
  }

  if (fichaje.clock_out !== null && body.started_at > startOfMinute(fichaje.clock_out)) {
    throw new ResponseError(
      "La hora de inicio no puede ser posterior a la salida del fichaje.",
      400,
      "ENTRY_STARTED_AT_AFTER_CLOCK_OUT",
    );
  }

  if (entry.ended_at !== null && body.started_at > startOfMinute(entry.ended_at)) {
    throw new ResponseError(
      "La hora de inicio no puede ser posterior a la hora de fin.",
      400,
      "ENTRY_STARTED_AT_AFTER_ENDED_AT",
    );
  }

  await updateFichajeEntryStartById(entryId, { started_at: body.started_at });
}
