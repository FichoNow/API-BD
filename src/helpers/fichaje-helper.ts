import { findFichajeById } from "../database/repositories/fichajes/fichaje-repository.js";
import { FichajeRow } from "../types/db/fichajes/fichaje-row-type.js";
import { ResponseError } from "../types/express/response-type.js";

/**
 * Busca un fichaje y verifica que pertenece al usuario dado.
 * Lanza ResponseError 404 si no existe o no es del usuario.
 */
export async function verifyFichajeOwnership(
  fichajeId: number,
  userId: number,
): Promise<FichajeRow> {
  const fichaje = await findFichajeById(fichajeId);

  if (!fichaje || fichaje.user_id !== userId) {
    throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
  }

  return fichaje;
}
