import {
  findUserById,
  findUserByEmail,
  updateUserById,
} from "../../database/repositories/user-repository.js";
import { findGroupById } from "../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../database/repositories/department-repository.js";
import { UpdateUserRow } from "../../types/db/user-row-type.js";
import { PatchUserBody } from "../../types/dto/admin/patch-user-body.js";
import { JwtClaims } from "../../types/dto/jwt/jwt-claims-dto.js";
import { hashPassword } from "../auth/password-hash-service.js";
import { PatchUserResponse } from "../../types/dto/admin/patch-user-response.js";
import { ResponseError } from "../../types/express/response-type.js";

export async function updateUser(
  userId: number,
  body: PatchUserBody,
  claims: JwtClaims,
): Promise<PatchUserResponse> {
  const { password, ...rest } = body;

  const user = await findUserById(userId);
  const userDepartment = user ? await findDepartmentById(user.department_id) : null;

  if (
    !user ||
    !userDepartment ||
    userDepartment.company_id !== claims.company_id ||
    user.role === "ADMINISTRATOR"
  ) {
    throw new ResponseError("Usuario no encontrado", 404, "USER_NOT_FOUND");
  }

  if (rest.department_id !== undefined) {
    const department = await findDepartmentById(rest.department_id);

    if (!department || department.company_id !== claims.company_id) {
      throw new ResponseError("Departamento no encontrado.", 404, "DEPARTMENT_NOT_FOUND");
    }
  }

  if (rest.group_id) {
    const group = await findGroupById(rest.group_id);
    const targetDepartmentId = rest.department_id ?? user.department_id;

    if (!group || group.department_id !== targetDepartmentId) {
      throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
    }
  }

  if (rest.email) {
    const emailTaken = await findUserByEmail(rest.email);
    if (emailTaken && emailTaken.id !== userId) {
      throw new ResponseError(
        "Ya existe un usuario con ese email.",
        409,
        "EMAIL_ALREADY_EXISTS",
      );
    }
  }

  const dataToUpdate: UpdateUserRow = { ...rest };

  if (password !== undefined) {
    dataToUpdate.password_hash = await hashPassword(password);
    dataToUpdate.must_change_password = true;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw new ResponseError(
      "No hay campos para actualizar.",
      400,
      "NO_FIELDS_TO_UPDATE",
    );
  }

  const updated = await updateUserById(userId, dataToUpdate);

  if (!updated) {
    throw new ResponseError("Error al actualizar el usuario.", 500, "UPDATE_FAILED");
  }

  const updatedUser = await findUserById(userId);

  if (!updatedUser) {
    throw new ResponseError("Error al obtener el usuario actualizado.", 500, "USER_NOT_FOUND");
  }

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    group_id: updatedUser.group_id,
    is_active: updatedUser.is_active,
    must_change_password: updatedUser.must_change_password,
    updated_at: updatedUser.updated_at,
  };
}
