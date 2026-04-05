import { Request, Response } from "express";
import {
  PatchClockOutModifiedBody,
  PatchClockOutModifiedBodySchema,
} from "../../../../types/dto/user/fichajes/patch-clock-out-modified-body.js";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { updateClockOutModifiedService } from "../../../../services/user/fichajes/update-clock-out-modified-service.js";

export async function patchClockOutModifiedController(
  req: Request<{ id: string }, unknown, PatchClockOutModifiedBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchClockOutModifiedBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido.",
      400,
      "BAD_REQUEST",
    );
  }

  const userId = req.jwtClaims!.id;

  await updateClockOutModifiedService(fichajeId, parsed.data, userId);

  res.status(200).json({ data: null });
}
