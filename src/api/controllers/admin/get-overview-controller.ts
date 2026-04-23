import { Request, Response } from "express";
import { BodyResponse } from "../../../types/express/response-type.js";
import { GetOverviewResponse } from "../../../types/dto/admin/get-overview-response.js";
import { getOverviewService } from "../../../services/admin/get-overview-service.js";

export async function getOverviewController(
  req: Request,
  res: Response<BodyResponse<GetOverviewResponse>>,
) {
  const data = await getOverviewService(req.jwtClaims!);
  return res.status(200).json({ data });
}
