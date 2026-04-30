import { createDepartment } from "../../database/repositories/department-repository.js";
import { findDepartmentsByCompanyId } from "../../database/repositories/department-repository.js";
import { JwtClaims } from "../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../types/express/response-type.js";

export async function createDepartmentService(
  name: string,
  claims: JwtClaims,
): Promise<{ id: number; name: string }> {
  const existing = await findDepartmentsByCompanyId(claims.company_id);

  if (existing.some((d) => d.name.toLowerCase() === name.toLowerCase())) {
    throw new ResponseError("Ya existe un departamento con ese nombre", 409, "DEPARTMENT_NAME_TAKEN");
  }

  const id = await createDepartment({ company_id: claims.company_id, name });

  return { id, name };
}
