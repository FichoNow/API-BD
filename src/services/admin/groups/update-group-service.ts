import {
  findGroupById,
  findGroupByNameAndDepartment,
  updateGroupById,
} from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { PatchGroupBody } from "../../../types/dto/admin/patch-group-body.js";
import { GroupResponse } from "../../../types/dto/admin/group-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function updateGroupService(
  groupId: number,
  body: PatchGroupBody,
  claims: JwtClaims,
): Promise<GroupResponse> {
  const group = await findGroupById(groupId);
  if (!group) {
    throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
  }

  const department = await findDepartmentById(group.department_id);
  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== group.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  if (body.name && body.name !== group.name) {
    const existing = await findGroupByNameAndDepartment(body.name, group.department_id);
    if (existing && existing.id !== groupId) {
      throw new ResponseError(
        "Ya existe un grupo con ese nombre.",
        409,
        "GROUP_ALREADY_EXISTS",
      );
    }
  }

  const updated = await updateGroupById(groupId, body);
  if (!updated) {
    throw new ResponseError("No se pudo actualizar el grupo.", 500, "GROUP_UPDATE_FAILED");
  }

  return {
    id: groupId,
    name: body.name ?? group.name,
    department_id: group.department_id,
  };
}
