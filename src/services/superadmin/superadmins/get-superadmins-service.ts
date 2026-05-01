import { findSuperadminsByCompanyId } from "../../../database/repositories/user-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { GetSuperadminsResponse } from "../../../types/dto/superadmin/superadmins/get-superadmins-response.js";

export async function getSuperadminsService(claims: JwtClaims): Promise<GetSuperadminsResponse> {
  const admins = await findSuperadminsByCompanyId(claims.company_id);
  return admins.map((a) => ({
    id:        Number(a.id),
    name:      String(a.name),
    email:     String(a.email),
    is_active: Boolean(a.is_active),
  }));
}
