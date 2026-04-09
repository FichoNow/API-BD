import { createFichaje } from "../../../database/repositories/fichajes/fichaje-repository.js";
import { PostFichajeBody } from "../../../types/dto/user/fichajes/post-fichaje-body.js";
import { PostFichajeResponse } from "../../../types/dto/user/fichajes/post-fichaje-response.js";

/**
 * Lógica de negocio para crear un nuevo fichaje.
 * @param body Datos del fichaje (clock_in).
 * @param userId ID del usuario autenticado (extraído del JWT).
 * @returns El ID del fichaje creado.
 */
export async function createFichajeService(
  body: PostFichajeBody,
  userId: number,
): Promise<PostFichajeResponse> {
  const id = await createFichaje({
    user_id: userId,
    clock_in: body.clock_in,
  });

  return { id };
}
