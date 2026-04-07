import { Request, Response } from "express";
import {  PostFichajeEntryBody, PostFichajeEntryBodySchema } from "../../../../../types/dto/user/fichajes/entries/post-fichaje-entry-body.js";
import { 
    BodyResponse,
    ResponseError,
  } from "../../../../../types/express/response-type.js";
import { createFichajeEntryService } from "../../../../../services/user/fichajes/entries/create-fichaje-entry-service.js";
import { PostFichajeEntryResponse } from "../../../../../types/dto/user/fichajes/entries/post-fichaje-entry-response.js";

export async function postFichajeEntryController(
    req: Request<{ id: string }, unknown, PostFichajeEntryBody>,
    res: Response<BodyResponse<PostFichajeEntryResponse>>,
) {
    const fichajeId = Number(req.params.id);

    if(!Number.isInteger(fichajeId) || fichajeId <= 0){
        throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
    }

    const parsed = PostFichajeEntryBodySchema.safeParse(req.body);

    if(!parsed.success){
        throw new ResponseError(
            "Cuerpo de la solicitud inválido.",
            400,
            "BAD_REQUEST",
        );
    }

    const userId = req.jwtClaims!.id;

    const data = await createFichajeEntryService(
        fichajeId,
        parsed.data,
        userId,
    );

    res.status(201).json({ data });
}