import { deleteFichajeById } from "../../../database/repositories/fichajes/fichaje-repository.js";
import { verifyFichajeOwnership } from "../../../helpers/fichaje-helper.js";

/**
 * Lógica de negocio para eliminar un fichaje del usuario autenticado.
 * @param fichajeId ID del fichaje a eliminar.
 * @param userId ID del usuario autenticado (extraído del JWT).
 */
export async function deleteFichajeService(
  fichajeId: number,
  userId: number,
): Promise<void> {
  await verifyFichajeOwnership(fichajeId, userId);
  await deleteFichajeById(fichajeId);
}
