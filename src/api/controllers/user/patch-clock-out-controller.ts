import { Request, Response } from "express";
import {
  PatchClockOutBody,
  PatchClockOutBodySchema,
} from "../../../types/dto/user/patch-clock-out-body.js";
import {
  BodyResponse,
  ResponseError,
} from "../../../types/express/response-type.js";
import { updateClockOutService } from "../../../services/user/update-clock-out-service.js";

export async function patchClockOutController(
  req: Request<{ id: string }, unknown, PatchClockOutBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchClockOutBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido.",
      400,
      "BAD_REQUEST",
    );
  }

  const userId = req.jwtClaims!.id;

  await updateClockOutService(fichajeId, parsed.data, userId);

  res.status(200).json({ data: null });
}
