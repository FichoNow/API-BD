import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { OvertimeYearlyResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getOvertimeYearlyService } from "../../../../services/admin/stats/get-overtime-yearly-service.js";

export async function getOvertimeYearlyController(
  req: Request,
  res: Response<BodyResponse<OvertimeYearlyResponse>>,
) {
  const departmentId = Number(req.query.departmentId);
  const groupId      = req.query.groupId ? Number(req.query.groupId) : undefined;
  const userId       = req.query.userId  ? Number(req.query.userId)  : undefined;
  const year         = req.query.year    ? Number(req.query.year)    : undefined;

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }

  const data = await getOvertimeYearlyService(departmentId, req.jwtClaims!, groupId, userId, year);
  return res.status(200).json({ data });
}
