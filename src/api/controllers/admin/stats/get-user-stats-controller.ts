import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { UserStatsResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getUserStatsService } from "../../../../services/admin/stats/get-user-stats-service.js";

export async function getUserStatsController(
  req: Request,
  res: Response<BodyResponse<UserStatsResponse>>,
) {
  const departmentId = Number(req.query.departmentId);
  const userId       = Number(req.params.userId);
  const month        = req.query.month ? Number(req.query.month) : undefined;
  const year         = req.query.year  ? Number(req.query.year)  : undefined;

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }
  if (!userId || isNaN(userId)) {
    throw new ResponseError("userId inválido", 400, "BAD_REQUEST");
  }

  const data = await getUserStatsService(departmentId, userId, req.jwtClaims!, month, year);
  return res.status(200).json({ data });
}
