import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { GetProjectStatsResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getProjectStatsService } from "../../../../services/admin/stats/get-project-stats-service.js";

export async function getProjectStatsController(
  req: Request,
  res: Response<BodyResponse<GetProjectStatsResponse>>,
) {
  const departmentId  = Number(req.query.departmentId);
  const projectName   = req.query.projectName as string | undefined;
  const month         = req.query.month    ? Number(req.query.month) : undefined;
  const year          = req.query.year     ? Number(req.query.year)  : undefined;
  const allTime       = req.query.all_time === "true";

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }
  if (!projectName) {
    throw new ResponseError("projectName es obligatorio", 400, "BAD_REQUEST");
  }

  const data = await getProjectStatsService(departmentId, projectName, req.jwtClaims!, month, year, allTime);
  return res.status(200).json({ data });
}
