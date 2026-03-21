import { findCompanyById } from "../../database/repositories/company-repository.js";
import {
  findUserByEmail,
  updateLastLoginAt,
} from "../../database/repositories/user-repository.js";
import { PostLoginResponse } from "../../types/dto/endpoints/auth/post-login-response.js";
import { issueJwt } from "./access-token-service.js";

/**
 * Ejecuta la lógica de autenticación de un usuario.
 *
 * Busca al usuario por email, comprueba que exista, que esté activo y valida su contraseña.
 * También verifica que la empresa del usuario exista y esté activa.
 * Si todo es correcto, actualiza la fecha del último login y devuelve la respuesta de login.
 *
 * @param email Email del usuario que intenta iniciar sesión.
 * @param password Contraseña recibida en la petición.
 * @returns Los datos de login si la autenticación es correcta, o `null` si falla.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<PostLoginResponse | null> {
  // Buscamos al usuario en base de datos a partir del email recibido.
  const userRow = await findUserByEmail(email);

  if (!userRow) {
    return null;
  }

  if (!userRow.is_active) {
    return null;
  }

  //Falta logica de hash de contraseñas
  if (userRow.password_hash !== password) {
    return null;
  }

  const company = await findCompanyById(userRow.company_id);

  if (!company || !company.is_active) {
    return null;
  }

  // actualizamos la fecha del último acceso del usuario.
  await updateLastLoginAt(userRow.id);

  const accessToken = issueJwt({
    id: userRow.id,
    companyId: userRow.company_id,
    groupId: userRow.group_id,
    role: userRow.role,
  });

  return {
    accessToken,
    refreshToken: "123",
    userData: {
      name: userRow.name,
      role: userRow.role,
      companyName: company.name,
    },
  };
}
