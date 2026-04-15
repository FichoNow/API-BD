import {
  findFichajeEntryById,
  updateFichajeEntryProjectById,
} from "../../../../database/repositories/fichajes/fichaje-entry-repository.js";
import { findProjectById } from "../../../../database/repositories/project-repository.js";
import { verifyFichajeOwnership } from "../../../../helpers/fichaje-helper.js";
import { PatchFichajeEntryProjectBody } from "../../../../types/dto/user/fichajes/entries/patch-fichaje-entry-project-body.js";
import { ResponseError } from "../../../../types/express/response-type.js";

/**
 * Lógica de negocio para cambiar el proyecto asignado a una entry de fichaje.
 * Verifica que el fichaje pertenece al usuario, que la entry existe dentro
 * de ese fichaje y que el proyecto nuevo existe en la base de datos.
 *
 * @param fichajeId ID del fichaje al que pertenece la entry.
 * @param entryId ID de la entry a modificar.
 * @param body Cuerpo de la petición con el nuevo project_id.
 * @param userId ID del usuario autenticado.
 */
export async function updateFichajeEntryProjectService(
  fichajeId: number,
  entryId: number,
  body: PatchFichajeEntryProjectBody,
  userId: number,
): Promise<void> {
  await verifyFichajeOwnership(fichajeId, userId);

  const entry = await findFichajeEntryById(entryId);

  if (!entry || entry.fichaje_id !== fichajeId) {
    throw new ResponseError("Entry no encontrada.", 404, "FICHAJE_ENTRY_NOT_FOUND");
  }

  const project = await findProjectById(body.project_id);

  if (!project) {
    throw new ResponseError("Proyecto no encontrado.", 404, "PROJECT_NOT_FOUND");
  }

  await updateFichajeEntryProjectById(entryId, { project_id: body.project_id });
}
