import { createFichaje } from "../../database/repositories/fichaje-repository.js";
import { PostFichajeBody } from "../../types/dto/user/post-fichaje-body.js";
import { PostFichajeResponse } from "../../types/dto/user/post-fichaje-response.js";

/**
 * Lógica de negocio para crear un nuevo fichaje.
 * Inserta el fichaje en base de datos y devuelve los datos del fichaje creado.
 * @param body Datos del fichaje (clock_in).
 * @param userId ID del usuario autenticado (extraído del JWT).
 * @returns Los datos del fichaje creado.
 */
export async function createFichajeService(
  body: PostFichajeBody,
  userId: number,
): Promise<PostFichajeResponse> {
  const createdId = await createFichaje({
    user_id: userId,
    clock_in: body.clock_in,
  });

  return {
    id: createdId,
    user_id: userId,
    clock_in: body.clock_in,
    created_at: new Date(),
  };
}
