import {
  findFichajeEntryById,
  updateFichajeEntryEndById,
} from "../../../../database/repositories/fichajes/fichaje-entry-repository.js";
import { startOfMinute } from "date-fns";
import { verifyFichajeOwnership } from "../../../../helpers/fichaje-helper.js";
import { PatchFichajeEntryEndBody } from "../../../../types/dto/user/fichajes/entries/patch-fichaje-entry-end-body.js";
import { ResponseError } from "../../../../types/express/response-type.js";

/**
 * Lógica de negocio para cerrar una entry de fichaje.
 * Comprueba que el fichaje existe y pertenece al usuario,
 * que la entry existe y pertenece a ese fichaje,
 * y actualiza su ended_at.
 * @param fichajeId ID del fichaje.
 * @param entryId ID de la entry a cerrar.
 * @param body Datos de cierre de la entry.
 * @param userId ID del usuario autenticado.
 */
export async function updateFichajeEntryEndService(
  fichajeId: number,
  entryId: number,
  body: PatchFichajeEntryEndBody,
  userId: number,
): Promise<void> {
  const fichaje = await verifyFichajeOwnership(fichajeId, userId);

  const entry = await findFichajeEntryById(entryId);

  if (!entry || entry.fichaje_id !== fichajeId) {
    throw new ResponseError("Entry no encontrada.", 404, "FICHAJE_ENTRY_NOT_FOUND");
  }

  if (body.ended_at < startOfMinute(entry.started_at)) {
    throw new ResponseError(
      "La hora de fin no puede ser anterior o igual a la hora de inicio.",
      400,
      "ENTRY_ENDED_AT_BEFORE_STARTED_AT",
    );
  }

  if (body.ended_at < startOfMinute(fichaje.clock_in)) {
    throw new ResponseError(
      "La hora de fin no puede ser anterior a la entrada del fichaje.",
      400,
      "ENTRY_ENDED_AT_BEFORE_CLOCK_IN",
    );
  }

  if (fichaje.clock_out !== null && body.ended_at > startOfMinute(fichaje.clock_out)) {
    throw new ResponseError(
      "La hora de fin no puede ser posterior a la salida del fichaje.",
      400,
      "ENTRY_ENDED_AT_AFTER_CLOCK_OUT",
    );
  }

  await updateFichajeEntryEndById(entryId, { ended_at: body.ended_at });
}
