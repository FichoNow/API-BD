import { findCompanyById } from "../../database/repositories/company-repository.js";
import {
  findUserByEmail,
  updateLastLoginAt,
} from "../../database/repositories/user-repository.js";
import { PostLoginBody } from "../../types/dto/auth/post-login-body.js";
import { PostLoginResponse } from "../../types/dto/auth/post-login-response.js";
import { verifyPassword } from "./password-hash-service.js";
import { issueJwt } from "./access-token-service.js";
import { issueRefreshToken } from "./refresh-token-service.js";
import { ResponseError } from "../../types/express/response-type.js";

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
  body: PostLoginBody,
): Promise<PostLoginResponse> {
  const userRow = await findUserByEmail(body.email);

  if (!userRow) {
    throw new ResponseError("Credenciales incorrectas", 401, "UNAUTHORIZED");
  }

  if (!userRow.is_active) {
    throw new ResponseError("Credenciales incorrectas", 401, "UNAUTHORIZED");
  }

  if (!userRow.password_hash) {
    throw new ResponseError("Credenciales incorrectas", 401, "UNAUTHORIZED");
  }

  const isValidPassword = await verifyPassword(body.password, userRow.password_hash);

  if (!isValidPassword) {
    throw new ResponseError("Credenciales incorrectas", 401, "UNAUTHORIZED");
  }

  const company = await findCompanyById(userRow.company_id);

  if (!company || !company.is_active) {
    throw new ResponseError("Credenciales incorrectas", 401, "UNAUTHORIZED");
  }

  await updateLastLoginAt(userRow.id);

  const accessToken = issueJwt({
    id: userRow.id,
    company_id: userRow.company_id,
    group_id: userRow.group_id,
    role: userRow.role,
  });

  const refreshToken = await issueRefreshToken(userRow.id);

  return {
    accessToken,
    refreshToken,
    userData: {
      name: userRow.name,
      role: userRow.role,
      email: userRow.email,
      companyName: company.name,
      must_change_password: userRow.must_change_password,
    },
  };
}
