import {
  createGroup,
  findGroupByNameAndDepartment,
} from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { CreateGroupBody } from "../../../types/dto/admin/create-group-body.js";
import { GroupResponse } from "../../../types/dto/admin/group-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function createGroupService(
  body: CreateGroupBody,
  claims: JwtClaims,
): Promise<GroupResponse> {
  const department = await findDepartmentById(body.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Departamento no encontrado.", 404, "DEPARTMENT_NOT_FOUND");
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== body.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const existing = await findGroupByNameAndDepartment(body.name, body.department_id);

  if (existing) {
    throw new ResponseError(
      "Ya existe un grupo con ese nombre.",
      409,
      "GROUP_ALREADY_EXISTS",
    );
  }

  const id = await createGroup({
    name: body.name,
    department_id: body.department_id,
  });

  return {
    id,
    name: body.name,
    department_id: body.department_id,
  };
}
