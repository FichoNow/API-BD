import { Request, Response } from "express";
import { 
    PatchFichajeEntryEndBody,
    PatchFichajeEntryEndBodySchema,
} from "../../../types/dto/user/patch-fichaje-entry-end-body.js";
import {
    BodyResponse,
    ResponseError,
} from "../../../types/express/response-type.js";
import { updateFichajeEntryEndService } from "../../../services/user/update-fichaje-entry-end-service.js";
export async function patchFichajeEntryEndController(
    req: Request<{ id: string; entryId: string }, unknown, PatchFichajeEntryEndBody>,
    res: Response<BodyResponse<PatchFichajeEntryEndResponse>>,
) {
    const fichajeId = Number(req.params.id);
    const entryId = Number(req.params.entryId);

    if (!Number.isInteger(fichajeId) || fichajeId <= 0 || !Number.isInteger(entryId) || entryId <= 0){
        throw new ResponseError("ID inválido.", 400, "BAD_REQUEST");
    }

    // Validamos y convertimos el body de la petición al formato esperado.
    const parsed = PatchFichajeEntryEndBodySchema.safeParse(req.body);

    // Si el body no cumple el schema, devolvemos un error 400.
    if(!parsed.success){
        throw new ResponseError("Cuerpo de la solicitud inválido.", 400, "BAD_REQUEST");
    }

    // Obtenemos el id del usuario autenticado desde el token JWT.
    const userId = req.jwtClaims!.id;

    // Llamamos al service con los ids de la URL, el body ya validado y el usuario autenticado.
    const data = await updateFichajeEntryEndService(
        fichajeId,
        entryId,
        parsed.data,
        userId,
    );

    res.status(200).json({ data });
}