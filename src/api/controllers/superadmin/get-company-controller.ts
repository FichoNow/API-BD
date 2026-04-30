import { Request, Response } from "express";
import { BodyResponse } from "../../../types/express/response-type.js";
import { findCompanyById } from "../../../database/repositories/company-repository.js";
import { ResponseError } from "../../../types/express/response-type.js";

export interface GetCompanyResponse {
  id: number
  name: string
  cif_nif: string
  email: string
  address_line: string
  city: string
  postal_code: string
}

export async function getCompanyController(
  req: Request,
  res: Response<BodyResponse<GetCompanyResponse>>,
) {
  const company = await findCompanyById(req.jwtClaims!.company_id)
  if (!company) {
    throw new ResponseError("Empresa no encontrada", 404, "COMPANY_NOT_FOUND")
  }
  return res.status(200).json({
    data: {
      id:           company.id,
      name:         company.name,
      cif_nif:      company.cif_nif,
      email:        company.email,
      address_line: company.address_line,
      city:         company.city,
      postal_code:  company.postal_code,
    },
  })
}
