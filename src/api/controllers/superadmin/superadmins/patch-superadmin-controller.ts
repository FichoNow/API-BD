import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { PatchSuperadminBody, PatchSuperadminBodySchema } from "../../../../types/dto/superadmin/superadmins/patch-superadmin-body.js";
import { PatchSuperadminResponse } from "../../../../types/dto/superadmin/superadmins/patch-superadmin-response.js";
import { updateSuperadminService } from "../../../../services/superadmin/superadmins/update-superadmin-service.js";

export async function patchSuperadminController(
  req: Request<{ id: string }, unknown, PatchSuperadminBody>,
  res: Response<BodyResponse<PatchSuperadminResponse>>,
) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    throw new ResponseError("Id inválido", 400, "BAD_REQUEST");
  }

  const parsed = PatchSuperadminBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ResponseError("Datos inválidos", 400, "BAD_REQUEST");
  }

  const data = await updateSuperadminService(id, parsed.data, req.jwtClaims!);
  return res.status(200).json({ data });
}
