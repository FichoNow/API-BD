import {
  findUserById,
  findUserByEmail,
  updateUserById,
} from "../../database/repositories/user-repository.js";
import { UpdateUserRow } from "../../types/db/user-row-type.js";
import { UpdateSelfBody } from "../../types/dto/user/update-user-body.js";
import { hashPassword } from "../auth/password-hash-service.js";
import { UpdateSelfResponse } from "../../types/dto/user/update-user-response.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Ejecuta la lógica de actualización del propio perfil por parte del usuario autenticado.
 *
 * Verifica que el usuario exista, construye el objeto de actualización mapeando
 * los campos del body al formato de la base de datos (ej: password → password_hash),
 * persiste los cambios y devuelve los datos actualizados del usuario.
 *
 * @param userId ID del usuario autenticado (extraído del JWT).
 * @param body Campos a actualizar recibidos del body de la petición.
 * @returns Los datos actualizados del usuario, o `null` si no existe.
 */
export async function updateSelf(
  userId: number,
  body: UpdateSelfBody,
): Promise<UpdateSelfResponse | null> {
  const { password, ...rest } = body;

  const user = await findUserById(userId);

  if (!user) {
    return null;
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

  const updated = await updateUserById(userId, dataToUpdate);

  if (!updated) {
    return null;
  }

  const updatedUser = await findUserById(userId);

  if (!updatedUser) {
    return null;
  }

  return {
    name: updatedUser.name,
    email: updatedUser.email,
  };
}
