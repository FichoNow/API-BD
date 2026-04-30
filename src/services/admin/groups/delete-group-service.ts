import {
  countUsersInGroup,
  deleteGroupById,
  findGroupById,
} from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function deleteGroupService(
  groupId: number,
  claims: JwtClaims,
): Promise<{ id: number }> {
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

  const usersCount = await countUsersInGroup(groupId);
  if (usersCount > 0) {
    throw new ResponseError(
      `No se puede eliminar: el grupo tiene ${usersCount} empleado(s) asignado(s).`,
      409,
      "GROUP_HAS_USERS",
    );
  }

  const deleted = await deleteGroupById(groupId);
  if (!deleted) {
    throw new ResponseError("No se pudo eliminar el grupo.", 500, "GROUP_DELETE_FAILED");
  }

  return { id: groupId };
}
