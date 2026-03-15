import {
  findUserByEmail,
  updateLastLoginAt,
} from "../database/repositories/user-repository.js";
import { LoginResponse } from "../types/auth/login-response.js";

/**
 * Ejecuta la lógica de autenticación de un usuario.
 *
 * Busca al usuario por email, comprueba que exista y valida su contraseña.
 * Si las credenciales son correctas, actualiza la fecha del último login
 * y devuelve la respuesta de login.
 *
 * @param email Email del usuario que intenta iniciar sesión.
 * @param password Contraseña recibida en la petición.
 * @returns Los datos de login si la autenticación es correcta, o `null` si falla.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse | null> {
  // Buscamos al usuario en base de datos a partir del email recibido.
  const user = await findUserByEmail(email);

  // Si no existe ningún usuario con ese email, el login falla.
  if (!user) {
    return null;
  }

  // Si el usuario existe pero está inactivo, no permitimos el login.
  if (!user.is_active) {
    return null;
  }

  //Falta logica de hash de contraseñas
  if (user.password_hash !== password) {
    return null;
  }

  // actualizamos la fecha del último acceso del usuario.
  await updateLastLoginAt(user.id);

  // Devolvemos únicamente los datos necesarios para la respuesta del login.
  return {
    accessToken: "123",
    refreshToken: "123",
    userData: {
      name: user.name,
      role: user.role,
    },
  };
}
