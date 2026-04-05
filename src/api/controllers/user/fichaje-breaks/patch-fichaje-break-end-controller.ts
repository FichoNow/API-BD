import { Request, Response } from "express";
import {
  PatchFichajeBreakEndBody,
  PatchFichajeBreakEndBodySchema,
} from "../../../../types/dto/user/fichaje-breaks/patch-fichaje-break-end-body.js";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import { updateFichajeBreakEndService } from "../../../../services/user/fichaje-breaks/update-fichaje-break-end-service.js";

export async function patchFichajeBreakEndController(
  req: Request<{ id: string; breakId: string }, unknown, PatchFichajeBreakEndBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);
  const breakId = Number(req.params.breakId);

  if (
    !Number.isInteger(fichajeId) || fichajeId <= 0 ||
    !Number.isInteger(breakId) || breakId <= 0
  ) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchFichajeBreakEndBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido.", 400, "BAD_REQUEST");
  }

  const userId = req.jwtClaims!.id;

  await updateFichajeBreakEndService(fichajeId, breakId, parsed.data, userId);

  res.status(200).json({ data: null });
}
