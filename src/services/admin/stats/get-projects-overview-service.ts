import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { getAllProjectsTotals } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { GetProjectsOverviewResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function getProjectsOverviewService(
  departmentId: number,
  claims: JwtClaims,
): Promise<GetProjectsOverviewResponse> {
  const department = await findDepartmentById(departmentId)
  if (!department || department.company_id !== claims.company_id)
    throw new ResponseError("Departamento no encontrado", 404, "DEPARTMENT_NOT_FOUND")
  if (claims.role === "ADMINISTRATOR" && claims.department_id !== departmentId)
    throw new ResponseError("No autorizado", 403, "FORBIDDEN")

  const projects     = await getAllProjectsTotals(departmentId)
  const total_minutes = projects.reduce((s, p) => s + p.minutes, 0)

  return { projects, total_minutes, total_projects: projects.length }
}
