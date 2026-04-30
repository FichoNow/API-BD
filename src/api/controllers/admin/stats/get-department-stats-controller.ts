import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { GetStatsResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getDepartmentStatsService } from "../../../../services/admin/stats/get-department-stats-service.js";

export async function getDepartmentStatsController(
  req: Request,
  res: Response<BodyResponse<GetStatsResponse>>,
) {
  const departmentId = Number(req.query.departmentId);
  const month        = req.query.month ? Number(req.query.month) : undefined;
  const year         = req.query.year  ? Number(req.query.year)  : undefined;

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }

  const data = await getDepartmentStatsService(departmentId, req.jwtClaims!, month, year);
  return res.status(200).json({ data });
}
