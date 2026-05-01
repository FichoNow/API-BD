import { Request, Response } from "express";
import { BodyResponse } from "../../../../types/express/response-type.js";
import { GetCompanyResponse } from "../../../../types/dto/superadmin/company/get-company-response.js";
import { getCompanyService } from "../../../../services/superadmin/company/get-company-service.js";

export async function getCompanyController(
  req: Request,
  res: Response<BodyResponse<GetCompanyResponse>>,
) {
  const data = await getCompanyService(req.jwtClaims!);
  return res.status(200).json({ data });
}
