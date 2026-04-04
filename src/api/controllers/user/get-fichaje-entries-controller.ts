import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../types/express/response-type.js";
import { getFichajeEntriesService } from "../../../services/user/get-fichaje-entries-service.js";
import { GetFichajeEntriesResponse } from "../../../types/dto/user/get-fichaje-entries-response.js";

export async function getFichajeEntriesController(
    req: Request<{ id: string }>,
    res: Response<BodyResponse<GetFichajeEntriesResponse>>,
) {
    const fichajeId = Number(req.params.id);

    if (!Number.isInteger(fichajeId) || fichajeId <= 0) {
        throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
    }

    const userId = req.jwtClaims!.id;

    const data = await getFichajeEntriesService(fichajeId, userId);

    res.status(200).json({ data });
}
