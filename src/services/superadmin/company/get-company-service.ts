import { findCompanyById } from "../../../database/repositories/company-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";
import { GetCompanyResponse } from "../../../types/dto/superadmin/company/get-company-response.js";

export async function getCompanyService(claims: JwtClaims): Promise<GetCompanyResponse> {
  const company = await findCompanyById(claims.company_id);
  if (!company) {
    throw new ResponseError("Empresa no encontrada", 404, "COMPANY_NOT_FOUND");
  }

  return {
    id:           company.id,
    name:         company.name,
    cif_nif:      company.cif_nif,
    email:        company.email,
    address_line: company.address_line,
    city:         company.city,
    postal_code:  company.postal_code,
    owner_id:     company.owner_id,
  };
}
