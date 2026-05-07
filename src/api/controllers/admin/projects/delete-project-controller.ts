import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { deleteProjectService } from "../../../../services/admin/projects/delete-project-service.js";

export async function deleteProjectController(
  req: Request<{ id: string }>,
  res: Response<BodyResponse<{ id: number }>>,
) {
  const projectId = Number(req.params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    throw new ResponseError("ID de proyecto no válido", 400, "INVALID_PROJECT_ID");
  }

  const data = await deleteProjectService(projectId, req.jwtClaims!);
  return res.status(200).json({ data });
}
