import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../types/express/response-type.js";
import { PatchCompanyBody, PatchCompanyBodySchema } from "../../../types/dto/superadmin/patch-company-body.js";
import { PatchCompanyResponse } from "../../../types/dto/superadmin/patch-company-response.js";
import { updateCompanyService } from "../../../services/superadmin/update-company-service.js";

export async function patchCompanyController(
  req: Request<unknown, unknown, PatchCompanyBody>,
  res: Response<BodyResponse<PatchCompanyResponse>>,
) {
  const parsed = PatchCompanyBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido", 400, "BAD_REQUEST");
  }

  const data = await updateCompanyService(parsed.data as PatchCompanyBody, req.jwtClaims!);

  return res.status(200).json({ data });
}
