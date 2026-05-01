import { Request, Response } from "express";
import { BodyResponse } from "../../../../types/express/response-type.js";
import { GetCompanyInfoResponse } from "../../../../types/dto/admin/overview/get-overview-response.js";
import { getCompanyInfoService } from "../../../../services/admin/overview/get-overview-service.js";

export async function getCompanyInfoController(
  req: Request,
  res: Response<BodyResponse<GetCompanyInfoResponse>>,
) {
  const data = await getCompanyInfoService(req.jwtClaims!);
  return res.status(200).json({ data });
}
