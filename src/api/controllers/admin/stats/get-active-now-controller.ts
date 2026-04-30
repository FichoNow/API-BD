import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { ActiveNowResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getActiveNowService } from "../../../../services/admin/stats/get-active-now-service.js";

export async function getActiveNowController(
  req: Request,
  res: Response<BodyResponse<ActiveNowResponse>>,
) {
  const departmentId = Number(req.query.departmentId);
  const groupId      = req.query.groupId ? Number(req.query.groupId) : undefined;

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }

  const data = await getActiveNowService(departmentId, req.jwtClaims!, groupId);
  return res.status(200).json({ data });
}
