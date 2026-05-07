import { findProjectById, deleteProjectById } from "../../../database/repositories/project-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function deleteProjectService(
  projectId: number,
  claims: JwtClaims,
): Promise<{ id: number }> {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new ResponseError("Proyecto no encontrado.", 404, "PROJECT_NOT_FOUND");
  }

  const department = await findDepartmentById(project.department_id);
  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Proyecto no encontrado.", 404, "PROJECT_NOT_FOUND");
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== project.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const deleted = await deleteProjectById(projectId);
  if (!deleted) {
    throw new ResponseError("No se pudo eliminar el proyecto.", 500, "PROJECT_DELETE_FAILED");
  }

  return { id: projectId };
}
