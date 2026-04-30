import {
  deleteUserById,
  findUserById,
} from "../../../database/repositories/user-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function deleteUserService(
  userId: number,
  claims: JwtClaims,
): Promise<{ id: number }> {
  if (claims.id === userId) {
    throw new ResponseError(
      "No puedes eliminar tu propio usuario.",
      400,
      "CANNOT_DELETE_SELF",
    );
  }

  const user = await findUserById(userId);
  if (!user) {
    throw new ResponseError("Usuario no encontrado", 404, "USER_NOT_FOUND");
  }

  const department = await findDepartmentById(user.department_id);
  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Usuario no encontrado", 404, "USER_NOT_FOUND");
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== user.department_id) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  if (user.role === "SUPERADMIN") {
    throw new ResponseError(
      "No se puede eliminar un usuario superadmin desde aquí.",
      403,
      "CANNOT_DELETE_SUPERADMIN",
    );
  }

  const deleted = await deleteUserById(userId);
  if (!deleted) {
    throw new ResponseError(
      "No se pudo eliminar el usuario.",
      500,
      "USER_DELETE_FAILED",
    );
  }

  return { id: userId };
}
