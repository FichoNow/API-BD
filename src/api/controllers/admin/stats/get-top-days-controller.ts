import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { TopDaysResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getTopDaysService } from "../../../../services/admin/stats/get-top-days-service.js";

export async function getTopDaysController(
  req: Request,
  res: Response<BodyResponse<TopDaysResponse>>,
) {
  const departmentId = Number(req.query.departmentId);
  const month        = req.query.month   ? Number(req.query.month)   : undefined;
  const year         = req.query.year    ? Number(req.query.year)    : undefined;
  const groupId      = req.query.groupId ? Number(req.query.groupId) : undefined;
  const userId       = req.query.userId  ? Number(req.query.userId)  : undefined;

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }

  const data = await getTopDaysService(departmentId, req.jwtClaims!, month, year, groupId, userId);
  return res.status(200).json({ data });
}
