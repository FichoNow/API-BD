import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { PatchDepartmentBody, PatchDepartmentBodySchema } from "../../../../types/dto/superadmin/department/patch-department-body.js";
import { PatchDepartmentResponse } from "../../../../types/dto/superadmin/department/patch-department-response.js";
import { updateDepartmentService } from "../../../../services/superadmin/department/update-department-service.js";

export async function patchDepartmentController(
  req: Request<{ id: string }, unknown, PatchDepartmentBody>,
  res: Response<BodyResponse<PatchDepartmentResponse>>,
) {
  const departmentId = Number(req.params.id);
  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("ID de departamento inválido", 400, "BAD_REQUEST");
  }

  const parsed = PatchDepartmentBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ResponseError("Nombre inválido", 400, "BAD_REQUEST");
  }

  const data = await updateDepartmentService(departmentId, parsed.data.name, req.jwtClaims!);
  return res.status(200).json({ data });
}
