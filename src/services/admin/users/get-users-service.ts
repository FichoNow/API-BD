import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findUsersByDepartmentId } from "../../../database/repositories/user-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { GetUsersResponse } from "../../../types/dto/admin/get-users-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Devuelve los usuarios del departamento solicitado.
 *
 * - ADMINISTRATOR: solo puede ver su propio departamento.
 * - SUPERADMIN: puede ver cualquier departamento de su empresa.
 *
 * @param departmentId ID del departamento a consultar.
 * @param claims Claims del token del administrador autenticado.
 * @returns Lista de usuarios del departamento.
 */
export async function getUsersService(
  departmentId: number,
  claims: JwtClaims,
): Promise<GetUsersResponse> {
  const department = await findDepartmentById(departmentId);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Departamento no encontrado", 404, "DEPARTMENT_NOT_FOUND");
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== departmentId) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const users = await findUsersByDepartmentId(departmentId);

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    is_active: u.is_active,
    must_change_password: u.must_change_password,
    group_id: u.group_id,
  }));
}
