import { Request, Response } from "express";
import { z } from "zod";
import { BodyResponse, ResponseError } from "../../../types/express/response-type.js";
import { updateDepartmentService } from "../../../services/superadmin/update-department-service.js";

const bodySchema = z.object({ name: z.string().min(1).max(150) });

export async function patchDepartmentController(
  req: Request,
  res: Response<BodyResponse<{ id: number; name: string }>>,
) {
  const departmentId = Number(req.params.id)
  if (!departmentId || isNaN(departmentId)) {
    throw new ResponseError("ID de departamento inválido", 400, "BAD_REQUEST")
  }

  const parsed = bodySchema.safeParse(req.body)
  if (!parsed.success) {
    throw new ResponseError("Nombre inválido", 400, "BAD_REQUEST")
  }

  const data = await updateDepartmentService(departmentId, parsed.data.name, req.jwtClaims!)
  return res.status(200).json({ data })
}
