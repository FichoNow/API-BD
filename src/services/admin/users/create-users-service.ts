import {
  createUser,
  findUserByEmail,
} from "../../../database/repositories/user-repository.js";
import { findGroupById } from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { CreateUsersResponse } from "../../../types/dto/admin/create-users-response.js";
import { hashPassword } from "../../auth/password-hash-service.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { CreateUsersBody } from "../../../types/dto/admin/create-users-body.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { WorkGroupRow } from "../../../types/db/work-group-row-type.js";

export async function createUsersService(
  body: CreateUsersBody,
  claims: JwtClaims,
): Promise<CreateUsersResponse> {
  const groupCache = new Map<number, WorkGroupRow | null>();
  const emailCache = new Map<string, boolean>();
  const validationErrors: string[] = [];

  for (const user of body) {
    const department = await findDepartmentById(user.department_id);

    if (!department || department.company_id !== claims.company_id) {
      validationErrors.push(`El departamento del usuario ${user.email} no existe.`);
      continue;
    }

    if (user.group_id !== null) {
      let group = groupCache.get(user.group_id);

      if (group === undefined) {
        group = await findGroupById(user.group_id);
        groupCache.set(user.group_id, group ?? null);
      }

      if (!group || group.department_id !== user.department_id) {
        validationErrors.push(`El grupo del usuario ${user.email} no existe.`);
      }
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
        department_id: u.department_id,
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
        company_id: claims.company_id,
        department_id: u.department_id,
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
