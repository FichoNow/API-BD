import { findFichajeById } from "../../../../database/repositories/fichajes/fichaje-repository.js";
import { findFichajeEntriesByFichajeId } from "../../../../database/repositories/fichajes/fichaje-entry-repository.js";
import { GetFichajeEntriesResponse } from "../../../../types/dto/user/fichajes/entries/get-fichaje-entries-response.js";
import { ResponseError } from "../../../../types/express/response-type.js";

/**
 * Lógica de negocio para obtener las entries de un fichaje concreto.
 * Comprueba que el fichaje existe y pertenece al usuario autenticado,
 * y devuelve todas sus entries ordenadas por hora de inicio.
 * @param fichajeId ID del fichaje.
 * @param userId ID del usuario autenticado.
 * @returns Lista de entries del fichaje.
 */
export async function getFichajeEntriesService(
    fichajeId: number,
    userId: number,
): Promise<GetFichajeEntriesResponse> {
    const fichaje = await findFichajeById(fichajeId);

    if(!fichaje || fichaje.user_id !== userId){
        throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
    }

    const entries = await findFichajeEntriesByFichajeId(fichajeId);

    // "map" permite recorrer un array para constuir uno nuevo a partir de él.
    // "entry" lo usamos para que el array de salida esté compuesto unicamente de los campos que nos interesan.
    return entries.map((entry) => ({
        id: entry.id,
        fichaje_id: entry.fichaje_id,
        project_id: entry.project_id,
        started_at: entry.started_at,
        ended_at: entry.ended_at,
    }));
}