import { findGroupsByDepartmentId } from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { GroupsListResponse } from "../../../types/dto/admin/groups/group-response.js";

export async function listGroupsService(
  departmentId: number,
  claims: JwtClaims,
): Promise<GroupsListResponse> {
  const department = await findDepartmentById(departmentId);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Departamento no encontrado.", 404, "DEPARTMENT_NOT_FOUND");
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== departmentId) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const rows = await findGroupsByDepartmentId(departmentId);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    department_id: r.department_id,
  }));
}
