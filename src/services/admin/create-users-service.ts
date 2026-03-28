import {
  createUser,
  findUserByEmail,
} from "../../database/repositories/user-repository.js";
import { findGroupById } from "../../database/repositories/work-group-repository.js";
import { CreateUsersResponse } from "../../types/dto/admin/create-users-response.js";
import { hashPassword } from "../auth/password-hash-service.js";
import { ResponseError } from "../../types/express/response-type.js";
import { CreateUsersBody } from "../../types/dto/admin/create-users-body.js";
import { WorkGroupRow } from "../../types/db/work-group-row-type.js";

/**
 * Lógica de negocio para crear usuarios en bulk.
 * Recibe un array de usuarios, comprueba que ningún email esté registrado y que
 * los grupos pertenezcan a la empresa, genera los hashes de contraseña y crea los usuarios.
 * Devuelve los datos de los usuarios creados.
 * @param body Array de datos de los nuevos usuarios a crear.
 * @param companyId ID de la empresa del administrador autenticado (extraído del JWT). Se usa para
 *   asegurarse de que los grupos asignados pertenecen a la misma empresa y para asociar los usuarios a ella.
 * @returns Los datos de los usuarios creados.
 */
export async function createUsersService(
  body: CreateUsersBody,
  companyId: number,
): Promise<CreateUsersResponse> {
  const groupCache = new Map<number, WorkGroupRow | null>();
  const emailCache = new Map<string, boolean>();
  const validationErrors: string[] = [];

  for (const user of body) {
    let group: WorkGroupRow | null | undefined = undefined;

    if (user.group_id !== null) {
      group = groupCache.get(user.group_id);

      if (group === undefined) {
        group = await findGroupById(user.group_id);
        groupCache.set(user.group_id, group ?? null);
      }
    }

    if (!group || group.company_id !== companyId) {
      validationErrors.push(`El grupo del usuario ${user.email} no existe.`);
    }

    let emailExists = emailCache.get(user.email);

    if (emailExists === undefined) {
      const existingUser = await findUserByEmail(user.email);
      emailExists = !!existingUser;
      emailCache.set(user.email, emailExists);
    }

    if (emailExists) {
      validationErrors.push(`Ya existe un usuario con el email ${user.email}.`);
    }
  }

  if (validationErrors.length > 0) {
    throw new ResponseError(
      validationErrors.join("\n"),
      409,
      "BULK_USER_VALIDATION_ERROR",
    );
  }

  const createdUsers = await Promise.all(
    body.map(async (u) => {
      const passwordHash = await hashPassword(u.password);

      const createdId = await createUser({
        company_id: companyId,
        group_id: u.group_id,
        email: u.email,
        name: u.name,
        role: u.role,
        password_hash: passwordHash,
        is_active: u.is_active,
        must_change_password: true,
      });

      return {
        id: createdId,
        company_id: companyId,
        group_id: u.group_id,
        email: u.email,
        name: u.name,
        role: u.role,
        is_active: u.is_active,
        must_change_password: true,
      };
    }),
  );

  return createdUsers;
}
