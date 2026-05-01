import { Request, Response } from "express";
import { BodyResponse } from "../../../../types/express/response-type.js";
import { GetSuperadminsResponse } from "../../../../types/dto/superadmin/superadmins/get-superadmins-response.js";
import { getSuperadminsService } from "../../../../services/superadmin/superadmins/get-superadmins-service.js";

export async function getSuperadminsController(
  req: Request,
  res: Response<BodyResponse<GetSuperadminsResponse>>,
) {
  const data = await getSuperadminsService(req.jwtClaims!);
  return res.status(200).json({ data });
}
