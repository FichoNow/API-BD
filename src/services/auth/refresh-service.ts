import { PostRefreshBody } from "../../types/dto/auth/post-refresh-body.js";
import { PostRefreshResponse } from "../../types/dto/auth/post-refresh-response.js";
import { issueJwt } from "./access-token-service.js";
import { rotateRefreshToken } from "./refresh-token-service.js";
import { findDepartmentById } from "../../database/repositories/department-repository.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para renovar los tokens de sesión (access + refresh).
 * Implementa la rotación de refresh token: el token antiguo se invalida
 * y se genera uno nuevo en cada uso.
 * @param body Cuerpo de la petición con el refresh token actual.
 * @returns Nuevo access token y nuevo refresh token.
 */
export async function refreshUser(
  body: PostRefreshBody,
): Promise<PostRefreshResponse> {
  const { userData, newRefreshToken } = await rotateRefreshToken(body.refreshToken);

  const department = await findDepartmentById(userData.department_id);

  if (!department) {
    throw new ResponseError("Token inválido", 401, "UNAUTHORIZED");
  }

  const accessToken = issueJwt({
    id: userData.id,
    company_id: department.company_id,
    department_id: userData.department_id,
    group_id: userData.group_id,
    role: userData.role,
  });

  return { accessToken, refreshToken: newRefreshToken };
}
