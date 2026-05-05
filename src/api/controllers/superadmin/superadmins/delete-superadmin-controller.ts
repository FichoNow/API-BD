import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { deleteSuperadminService } from "../../../../services/superadmin/superadmins/delete-superadmin-service.js";

export async function deleteSuperadminController(
  req: Request<{ id: string }>,
  res: Response<BodyResponse<{ deleted: true }>>,
) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    throw new ResponseError("Id inválido", 400, "BAD_REQUEST");
  }

  await deleteSuperadminService(id, req.jwtClaims!);
  return res.status(200).json({ data: { deleted: true } });
}
