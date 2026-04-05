import { findFichajeById } from "../database/repositories/fichaje-repository.js";
import { FichajeRowType } from "../types/db/fichaje-row-type.js";
import { ResponseError } from "../types/express/response-type.js";

/**
 * Busca un fichaje y verifica que pertenece al usuario dado.
 * Lanza ResponseError 404 si no existe o no es del usuario.
 */
export async function verifyFichajeOwnership(
  fichajeId: number,
  userId: number,
): Promise<FichajeRowType> {
  const fichaje = await findFichajeById(fichajeId);

  if (!fichaje || fichaje.user_id !== userId) {
    throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
  }

  return fichaje;
}

/**
 * Trunca una fecha al minuto exacto (elimina segundos y milisegundos).
 */
export function toMinute(date: Date): Date {
  return new Date(Math.floor(date.getTime() / 60000) * 60000);
}
