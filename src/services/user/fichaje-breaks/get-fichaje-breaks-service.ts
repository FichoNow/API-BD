import { findFichajeBreaksByFichajeId } from "../../../database/repositories/fichaje-break-repository.js";
import { verifyFichajeOwnership } from "../../../helpers/fichaje-helper.js";
import { GetFichajeBreaksResponse } from "../../../types/dto/user/fichaje-breaks/get-fichaje-breaks-response.js";

export async function getFichajeBreaksService(
  fichajeId: number,
  userId: number,
): Promise<GetFichajeBreaksResponse> {
  await verifyFichajeOwnership(fichajeId, userId);

  const breaks = await findFichajeBreaksByFichajeId(fichajeId);

  return breaks.map((b) => ({
    id: b.id,
    fichaje_id: b.fichaje_id,
    started_at: b.started_at,
    ended_at: b.ended_at,
  }));
}
