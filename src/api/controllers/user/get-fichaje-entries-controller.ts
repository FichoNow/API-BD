import { Request, Response } from "express";
import {
  GetFichajeEntriesQuery,
  GetFichajeEntriesQuerySchema,
} from "../../../types/dto/user/get-fichaje-entries-query.js";
import { BodyResponse, ResponseError } from "../../../types/express/response-type.js";
import { getFichajeEntriesService } from "../../../services/user/get-fichaje-entries-service.js";
import { GetFichajeEntriesResponse } from "../../../types/dto/user/get-fichaje-entries-response.js";

export async function getFichajeEntriesController(
    req: Request<unknown, unknown, unknown, GetFichajeEntriesQuery>,
    res: Response<BodyResponse<GetFichajeEntriesResponse>>,
) {
    const parsed = GetFichajeEntriesQuerySchema.safeParse(req.query);

    if(!parsed.success){
        throw new ResponseError(
            "Parámetros de consulta inválidos.",
            400,
            "BAD_REQUEST",
        );
    }

    const userId = req.jwtClaims!.id;
    
    const data = await getFichajeEntriesService(
        parsed.data.fichaje_id,
        userId,
    );

    res.status(200).json({ data });
}

