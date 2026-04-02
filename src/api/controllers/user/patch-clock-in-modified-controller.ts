import { Request, Response } from "express";
import {
  PatchClockInModifiedBody,
  PatchClockInModifiedBodySchema,
} from "../../../types/dto/user/patch-clock-in-modified-body.js";
import {
  BodyResponse,
  ResponseError,
} from "../../../types/express/response-type.js";
import { updateClockInModifiedService } from "../../../services/user/update-clock-in-modified-service.js";

export async function patchClockInModifiedController(
  req: Request<{ id: string }, unknown, PatchClockInModifiedBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);

  if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchClockInModifiedBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido.",
      400,
      "BAD_REQUEST",
    );
  }

  const userId = req.jwtClaims!.id;

  await updateClockInModifiedService(fichajeId, parsed.data, userId);

  res.status(200).json({ data: null });
}
