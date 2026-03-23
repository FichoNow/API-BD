import {
  findUserById,
  findUserByEmail,
  updateUserById,
} from "../../database/repositories/user-repository.js";
import { UpdateUserRow } from "../../types/db/user-row-type.js";
import { UpdateUserBody } from "../../types/dto/admin/update-user-body.js";
import { hashPassword } from "../auth/password-hash-service.js";
import { UpdateUserResponse } from "../../types/dto/admin/update-user-response.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Ejecuta la lógica de actualización de un usuario por parte de un administrador.
 *
 * Verifica que el usuario exista, construye el objeto de actualización mapeando
 * los campos del body al formato de la base de datos (ej: password → password_hash),
 * persiste los cambios y devuelve los datos actualizados del usuario.
 *
 * @param userId ID del usuario a actualizar.
 * @param body Campos a actualizar recibidos del body de la petición.
 * @param adminCompanyId ID de la empresa del administrador que realiza la petición.
 * @returns Los datos actualizados del usuario.
 */
export async function updateUser(
  userId: number,
  body: UpdateUserBody,
  adminCompanyId: number,
): Promise<UpdateUserResponse> {
  const { password, ...rest } = body;

  const user = await findUserById(userId);

  if (
    !user ||
    user.company_id !== adminCompanyId ||
    user.role === "ADMINISTRATOR"
  ) {
    throw new ResponseError("Usuario no encontrado", 404, "USER_NOT_FOUND");
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
    job_title: updatedUser.job_title,
    group_id: updatedUser.group_id,
    is_active: updatedUser.is_active,
    updated_at: updatedUser.updated_at,
  };
}
