import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findProjectsByDepartmentId } from "../../../database/repositories/project-repository.js";
import { GetProjectsResponse } from "../../../types/dto/admin/projects/get-projects-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Devuelve los proyectos del departamento solicitado.
 *
 * - ADMINISTRATOR: solo puede ver proyectos de su propio departamento.
 * - SUPERADMIN: puede ver proyectos de cualquier departamento de su empresa.
 *
 * @param departmentId ID del departamento a consultar.
 * @param claims Claims del token del administrador autenticado.
 * @returns Lista de proyectos del departamento.
 */
export async function getProjectsService(
  departmentId: number,
  claims: JwtClaims,
): Promise<GetProjectsResponse> {
  const department = await findDepartmentById(departmentId);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Departamento no encontrado", 404, "DEPARTMENT_NOT_FOUND");
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== departmentId) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const projects = await findProjectsByDepartmentId(departmentId);

  return projects.map((project) => ({
    id: project.id,
    department_id: project.department_id,
    group_id: project.group_id,
    name: project.name,
    is_active: project.is_active,
    created_at: project.created_at,
  }));
}
