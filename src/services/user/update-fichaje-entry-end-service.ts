import { findFichajeById } from "../../database/repositories/fichaje-repository.js";
import {
  findFichajeEntryById,
  updateFichajeEntryEndById,
} from "../../database/repositories/fichaje-entry-repository.js";
import { PatchFichajeEntryEndBody } from "../../types/dto/user/patch-fichaje-entry-end-body.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para cerrar una entry de fichaje.
 * Comprueba que el fichaje existe y pertenece al usuario,
 * que la entry existe y pertenece a ese fichaje,
 * y actualiza su ended_at.
 * @param fichajeId ID del fichaje.
 * @param entryId ID de la entry a cerrar.
 * @param body Datos de cierre de la entry.
 * @param userId ID del usuario autenticado.
 * @returns Los datos de la entry cerrada.
 */
export async function updateFichajeEntryEndService(
    fichajeId: number,
    entryId: number,
    body: PatchFichajeEntryEndBody,
    userId: number,
): Promise<null> {
    const fichaje = await findFichajeById(fichajeId);

    if(!fichaje || fichaje.user_id !== userId){
        throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT FOUND");
    }

    const entry = await findFichajeEntryById(entryId);

    if(!entry || entry.fichaje_id !== fichajeId){
        throw new ResponseError("Entry no encontrada.", 404, "FICHAJE_ENTRY_NOT_FOUND");
    }

    await updateFichajeEntryEndById(entryId, { ended_at: body.ended_at });

    return null;
}