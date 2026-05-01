import { createUser, findUserByEmail } from "../../../database/repositories/user-repository.js";
import { hashPassword } from "../../auth/password-hash-service.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { PostSuperadminBody } from "../../../types/dto/superadmin/superadmins/post-superadmin-body.js";
import { PostSuperadminResponse } from "../../../types/dto/superadmin/superadmins/post-superadmin-response.js";

export async function createSuperadminService(
  body: PostSuperadminBody,
  claims: JwtClaims,
): Promise<PostSuperadminResponse> {
  const existing = await findUserByEmail(body.email);
  if (existing) {
    throw new ResponseError("Ya existe un usuario con ese email", 409, "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await hashPassword(body.password);

  const id = await createUser({
    department_id:        claims.department_id,
    group_id:             null,
    email:                body.email,
    name:                 body.name,
    role:                 "SUPERADMIN",
    password_hash:        passwordHash,
    is_active:            true,
    must_change_password: true,
  });

  return { id, name: body.name, email: body.email };
}
