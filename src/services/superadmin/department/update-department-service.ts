import { findDepartmentById, updateDepartmentName } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function updateDepartmentService(
  departmentId: number,
  name: string,
  claims: JwtClaims,
): Promise<{ id: number; name: string }> {
  const department = await findDepartmentById(departmentId)

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Departamento no encontrado", 404, "DEPARTMENT_NOT_FOUND")
  }

  await updateDepartmentName(departmentId, name.trim())

  return { id: departmentId, name: name.trim() }
}
