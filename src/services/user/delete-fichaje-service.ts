import { deleteFichajeById, findFichajeById } from "../../database/repositories/fichaje-repository.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para eliminar un fichaje del usuario autenticado.
 * @param fichajeId ID del fichaje a eliminar.
 * @param userId ID del usuario autenticado (extraído del JWT).
 */
export async function deleteFichajeService(
  fichajeId: number,
  userId: number,
): Promise<void> {
  const fichaje = await findFichajeById(fichajeId);

  if (!fichaje || fichaje.user_id !== userId) {
    throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
  }

  await deleteFichajeById(fichajeId);
}
