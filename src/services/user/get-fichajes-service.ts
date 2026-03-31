import { findFichajesByUserId } from "../../database/repositories/fichaje-repository.js";
import { GetFichajesResponse } from "../../types/dto/user/get-fichajes-response.js";

/**
 * Lógica de negocio para obtener los fichajes del usuario autenticado.
 * @param userId ID del usuario autenticado.
 * @returns Lista de fichajes del usuario.
 */
export async function getFichajesService(
  userId: number,
): Promise<GetFichajesResponse> {
  const fichajes = await findFichajesByUserId(userId, 20);

  return fichajes.map((fichaje) => ({
    id: fichaje.id,
    clock_in: fichaje.clock_in,
    clock_out: fichaje.clock_out,
  }));
}
