import { findCompanyById, updateCompany } from "../../database/repositories/company-repository.js";
import { PatchCompanyBody } from "../../types/dto/superadmin/patch-company-body.js";
import { PatchCompanyResponse } from "../../types/dto/superadmin/patch-company-response.js";
import { JwtClaims } from "../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../types/express/response-type.js";

export async function updateCompanyService(
  body: PatchCompanyBody,
  claims: JwtClaims,
): Promise<PatchCompanyResponse> {
  if (Object.keys(body).length === 0) {
    throw new ResponseError("No se han enviado campos a actualizar", 400, "EMPTY_BODY");
  }

  const company = await findCompanyById(claims.company_id);

  if (!company) {
    throw new ResponseError("Empresa no encontrada", 404, "COMPANY_NOT_FOUND");
  }

  await updateCompany(claims.company_id, body);

  const updated = await findCompanyById(claims.company_id);

  return {
    id: updated!.id,
    name: updated!.name,
    cif_nif: updated!.cif_nif,
    email: updated!.email,
    address_line: updated!.address_line,
    city: updated!.city,
    postal_code: updated!.postal_code,
    is_active: updated!.is_active,
  };
}
