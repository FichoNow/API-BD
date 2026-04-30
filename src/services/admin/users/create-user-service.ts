import {
  createUser,
  findUserByEmail,
} from "../../../database/repositories/user-repository.js";
import { findGroupById } from "../../../database/repositories/work-group-repository.js";
import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { CreateUserBody } from "../../../types/dto/admin/create-user-body.js";
import { CreateUserResponse } from "../../../types/dto/admin/create-user-response.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { hashPassword } from "../../auth/password-hash-service.js";
import { ResponseError } from "../../../types/express/response-type.js";

export async function createUserService(
  body: CreateUserBody,
  claims: JwtClaims,
): Promise<CreateUserResponse> {
  const department = await findDepartmentById(body.department_id);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Departamento no encontrado.", 404, "DEPARTMENT_NOT_FOUND");
  }

  if (body.group_id) {
    const group = await findGroupById(body.group_id);

    if (!group || group.department_id !== body.department_id) {
      throw new ResponseError("Grupo no encontrado.", 404, "GROUP_NOT_FOUND");
    }
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
    department_id: body.department_id,
    group_id: body.group_id,
    email: body.email,
    name: body.name,
    role: body.role,
    password_hash: passwordHash,
    is_active: body.is_active,
    must_change_password: true,
  });

  return {
    id: createdId,
    company_id: claims.company_id,
    department_id: body.department_id,
    group_id: body.group_id,
    email: body.email,
    name: body.name,
    role: body.role,
    is_active: body.is_active,
    must_change_password: true,
  };
}
