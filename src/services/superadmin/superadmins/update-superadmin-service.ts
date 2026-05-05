import { findUserById, findUserByEmail, updateUserById } from "../../../database/repositories/user-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { PatchSuperadminBody } from "../../../types/dto/superadmin/superadmins/patch-superadmin-body.js";
import { PatchSuperadminResponse } from "../../../types/dto/superadmin/superadmins/patch-superadmin-response.js";

/**
 * Actualiza nombre/email de un superadmin de la misma empresa.
 *
 * Reglas:
 * - Target debe existir, ser SUPERADMIN y pertenecer a la misma empresa.
 * - Si se cambia el email, no debe colisionar con otro usuario.
 * - Cualquier superadmin (incluido el owner) puede ser editado por otro superadmin de la empresa.
 */
export async function updateSuperadminService(
  targetId: number,
  body: PatchSuperadminBody,
  claims: JwtClaims,
): Promise<PatchSuperadminResponse> {
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

  if (body.email && body.email !== target.email) {
    const existing = await findUserByEmail(body.email);
    if (existing && existing.id !== targetId) {
      throw new ResponseError("Ya existe un usuario con ese email", 409, "EMAIL_ALREADY_EXISTS");
    }
  }

  await updateUserById(targetId, {
    name: body.name,
    email: body.email,
  });

  return {
    id:    targetId,
    name:  body.name ?? target.name,
    email: body.email ?? target.email,
  };
}
