import { findFichajeById } from "../../../../database/repositories/fichajes/fichaje-repository.js";
import { findFichajeBreaksByFichajeId } from "../../../../database/repositories/fichajes/fichaje-break-repository.js";
import { GetFichajeBreaksResponse } from "../../../../types/dto/user/fichajes/breaks/get-fichaje-breaks-response.js";
import { ResponseError } from "../../../../types/express/response-type.js";

export async function getFichajeBreaksService(
    fichajeId: number,
    userId: number,
): Promise<GetFichajeBreaksResponse> {
    const fichaje = await findFichajeById(fichajeId);

    if (!fichaje || fichaje.user_id !== userId) {
        throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
    }

    const breaks = await findFichajeBreaksByFichajeId(fichajeId);

    return breaks.map((b) => ({
        id: b.id,
        fichaje_id: b.fichaje_id,
        started_at: b.started_at,
        ended_at: b.ended_at,
    }));
}
