import { Request, Response } from "express";
import {
  PatchFichajeEntryProjectBody,
  PatchFichajeEntryProjectBodySchema,
} from "../../../../../types/dto/user/fichajes/entries/patch-fichaje-entry-project-body.js";
import { BodyResponse, ResponseError } from "../../../../../types/express/response-type.js";
import { updateFichajeEntryProjectService } from "../../../../../services/user/fichajes/entries/update-fichaje-entry-project-service.js";

export async function patchFichajeEntryProjectController(
  req: Request<{ id: string; entryId: string }, unknown, PatchFichajeEntryProjectBody>,
  res: Response<BodyResponse<null>>,
) {
  const fichajeId = Number(req.params.id);
  const entryId = Number(req.params.entryId);

  if (
    !Number.isInteger(fichajeId) ||
    fichajeId <= 0 ||
    !Number.isInteger(entryId) ||
    entryId <= 0
  ) {
    throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
  }

  const parsed = PatchFichajeEntryProjectBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError("Cuerpo de la solicitud inválido.", 400, "BAD_REQUEST");
  }

  const userId = req.jwtClaims!.id;

  await updateFichajeEntryProjectService(fichajeId, entryId, parsed.data, userId);

  res.status(200).json({ data: null });
}
