import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { GetProjectsOverviewResponse } from "../../../../types/dto/admin/get-stats-response.js";
import { getProjectsOverviewService } from "../../../../services/admin/stats/get-projects-overview-service.js";

export async function getProjectsOverviewController(
  req: Request,
  res: Response<BodyResponse<GetProjectsOverviewResponse>>,
) {
  const departmentId = Number(req.query.departmentId);

  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("departmentId es obligatorio", 400, "BAD_REQUEST");
  }

  const data = await getProjectsOverviewService(departmentId, req.jwtClaims!);
  return res.status(200).json({ data });
}
