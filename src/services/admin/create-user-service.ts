import {
  createUser,
  findUserById,
  findUserByEmail,
} from "../../database/repositories/user-repository.js";
import { findGroupById } from "../../database/repositories/work-group-repository.js";
import { CreateUserBody } from "../../types/dto/admin/create-user-body.js";
import { CreateUserResponse } from "../../types/dto/admin/create-user-response.js";
import { hashPassword } from "../auth/password-hash-service.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para crear un usuario nuevo.
 * Recibe los datos del nuevo usuario, comprueba que el email no esté registrado,
 * genera el hash de la contraseña y crea el usuario en base de datos.
 * Devuelve los datos del usuario creado.
 * @param body Datos del nuevo usuario a crear.
 * @param companyId ID de la empresa del administrador autenticado (extraído del JWT). Se usa para
 *   asegurarse de que el grupo asignado pertenece a la misma empresa y para asociar el nuevo usuario a ella.
 * @returns Los datos del usuario creado.
 */
export const createUserService = async (
  body: CreateUserBody,
  companyId: number,
): Promise<CreateUserResponse> => {
  const group = await findGroupById(body.group_id);

  if (!group || group.company_id !== companyId) {
    throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
  }

  const existingUser = await findUserByEmail(body.email);

  if (existingUser) {
    throw new ResponseError(
      "Ya existe un usuario con ese email.",
      409,
      "EMAIL_ALREADY_EXISTS",
    );
  }

  const passwordHash = await hashPassword(body.password);

  const createdId = await createUser({
    company_id: companyId,
    group_id: body.group_id,
    email: body.email,
    name: body.name,
    role: body.role,
    job_title: body.job_title,
    password_hash: passwordHash,
    is_active: body.is_active,
  });

  const newUser = await findUserById(createdId);

  if (!newUser) {
    throw new ResponseError("Error al crear el usuario.", 500, "USER_NOT_FOUND");
  }

  return {
    id: newUser.id,
    company_id: newUser.company_id,
    group_id: newUser.group_id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    job_title: newUser.job_title,
    is_active: newUser.is_active,
  };
};
