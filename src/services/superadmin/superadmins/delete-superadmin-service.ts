import { deleteUserById, findUserById } from "../../../database/repositories/user-repository.js";
import { findCompanyById } from "../../../database/repositories/company-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Borra un superadmin de la empresa del solicitante.
 *
 * Reglas:
 * - El target debe existir y ser SUPERADMIN.
 * - El target debe pertenecer a la misma empresa (vía department.company_id).
 * - El owner de la empresa NO puede ser borrado.
 * - Un superadmin no puede borrarse a sí mismo (evita lockout accidental).
 */
export async function deleteSuperadminService(targetId: number, claims: JwtClaims): Promise<void> {
  if (targetId === claims.id) {
    throw new ResponseError("No puedes eliminarte a ti mismo", 400, "SELF_DELETE_NOT_ALLOWED");
  }

  const target = await findUserById(targetId);
  if (!target) {
    throw new ResponseError("Superadmin no encontrado", 404, "SUPERADMIN_NOT_FOUND");
  }

  if (target.role !== "SUPERADMIN") {
    throw new ResponseError("El usuario no es superadmin", 400, "NOT_SUPERADMIN");
  }

  const targetDept = await findDepartmentById(target.department_id);
  if (!targetDept || targetDept.company_id !== claims.company_id) {
    throw new ResponseError("Superadmin no encontrado", 404, "SUPERADMIN_NOT_FOUND");
  }

  const company = await findCompanyById(claims.company_id);
  if (company?.owner_id === targetId) {
    throw new ResponseError("No se puede eliminar al owner de la empresa", 403, "OWNER_PROTECTED");
  }

  await deleteUserById(targetId);
}
