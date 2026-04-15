import { deleteRefreshTokenByUserId } from "../../../database/repositories/refresh-token-repository.js";

/**
 * Lógica de negocio para cerrar la sesión del usuario.
 * Elimina el refresh token del usuario de la base de datos,
 * invalidando cualquier intento de renovación de sesión posterior.
 *
 * @param userId ID del usuario cuya sesión se va a cerrar.
 */
export async function logoutUser(userId: number): Promise<void> {
  await deleteRefreshTokenByUserId(userId);
}
