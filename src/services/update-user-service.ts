import {
  findUserById,
  updateUserById,
} from "../database/repositories/user-repository.js";
import { UpdateUserRow } from "../types/db/user-row-type.js";
import { UpdateUserBody } from "../types/dto/enpoinds/admin/patch-user-body.js";
import { PatchUserResponse } from "../types/dto/enpoinds/admin/patch-user-response.js";

/**
 * Ejecuta la lógica de actualización de un usuario por parte de un administrador.
 *
 * Verifica que el usuario exista, construye el objeto de actualización mapeando
 * los campos del body al formato de la base de datos (ej: password → password_hash),
 * persiste los cambios y devuelve los datos actualizados del usuario.
 *
 * @param userId ID del usuario a actualizar.
 * @param body Campos a actualizar recibidos del body de la petición.
 * @returns Los datos actualizados del usuario, o `null` si no existe.
 */
export async function updateUser(
  userId: number,
  body: UpdateUserBody,
): Promise<PatchUserResponse | null> {
  const { password, ...rest } = body;

  const user = await findUserById(userId);

  if (!user) {
    return null;
  }

  const dataToUpdate: UpdateUserRow = { ...rest };

  if (password !== undefined) {
    // falta hashear la contraseña
    dataToUpdate.password_hash = password;
  }

  const updated = await updateUserById(userId, dataToUpdate);

  if (!updated) {
    return null;
  }

  const updatedUser = await findUserById(userId);

  if (!updatedUser) {
    return null;
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
