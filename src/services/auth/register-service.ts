import { createCompany } from "../../database/repositories/company-repository.js";
import { createDepartment } from "../../database/repositories/department-repository.js";
import { createUser, findUserByEmail } from "../../database/repositories/user-repository.js";
import { PostRegisterBody } from "../../types/dto/auth/post-register-body.js";
import { PostRegisterResponse } from "../../types/dto/auth/post-register-response.js";
import { ResponseError } from "../../types/express/response-type.js";
import { hashPassword } from "./password-hash-service.js";

/**
 * Ejecuta la lógica de registro de una nueva empresa con su usuario SUPERADMIN.
 *
 * Pasos que realiza en orden:
 * 1. Verifica que el email del usuario no esté ya registrado.
 * 2. Crea la empresa en la base de datos.
 * 3. Crea un departamento "General" vinculado a la empresa.
 * 4. Hashea la contraseña y crea el usuario con rol SUPERADMIN en ese departamento.
 *
 * @param body Datos validados de la empresa y del usuario administrador.
 * @returns Los datos básicos de la empresa y del usuario creados.
 * @throws {ResponseError} 409 EMAIL_ALREADY_EXISTS si el email ya está en uso.
 */
export async function registerCompany(body: PostRegisterBody): Promise<PostRegisterResponse> {
  const existingUser = await findUserByEmail(body.user.email);

  if (existingUser) {
    throw new ResponseError("Ya existe un usuario con ese email.", 409, "EMAIL_ALREADY_EXISTS");
  }

  const companyId = await createCompany({
    name: body.company.name,
    cif_nif: body.company.cif_nif,
    email: body.company.email,
    address_line: body.company.address_line,
    city: body.company.city,
    postal_code: body.company.postal_code,
  });

  const departmentId = await createDepartment({
    company_id: companyId,
    name: "General",
  });

  const passwordHash = await hashPassword(body.user.password);

  const userId = await createUser({
    department_id: departmentId,
    group_id: null,
    email: body.user.email,
    name: body.user.name,
    role: "SUPERADMIN",
    password_hash: passwordHash,
    is_active: true,
    must_change_password: false,
  });

  return {
    company: {
      id: companyId,
      name: body.company.name,
      cif_nif: body.company.cif_nif,
      email: body.company.email,
      address_line: body.company.address_line,
      city: body.company.city,
      postal_code: body.company.postal_code,
    },
    user: {
      id: userId,
      name: body.user.name,
      email: body.user.email,
      role: "SUPERADMIN",
    },
  };
}
