import {
  createFichajeBreak,
  findOpenBreakByFichajeId,
} from "../../../../database/repositories/fichaje-break-repository.js";
import { verifyFichajeOwnership, toMinute } from "../../../../helpers/fichaje-helper.js";
import { PostFichajeBreakBody } from "../../../../types/dto/user/fichajes/breaks/post-fichaje-break-body.js";
import { PostFichajeBreakResponse } from "../../../../types/dto/user/fichajes/breaks/post-fichaje-break-response.js";
import { ResponseError } from "../../../../types/express/response-type.js";

export async function createFichajeBreakService(
  fichajeId: number,
  body: PostFichajeBreakBody,
  userId: number,
): Promise<PostFichajeBreakResponse> {
  const fichaje = await verifyFichajeOwnership(fichajeId, userId);

  if (fichaje.clock_out !== null) {
    throw new ResponseError(
      "No se puede iniciar un descanso en un fichaje ya cerrado.",
      400,
      "FICHAJE_ALREADY_CLOSED",
    );
  }

  const openBreak = await findOpenBreakByFichajeId(fichajeId);
  if (openBreak) {
    throw new ResponseError(
      "Ya hay un descanso activo en este fichaje.",
      409,
      "BREAK_ALREADY_OPEN",
    );
  }

  if (body.started_at < toMinute(fichaje.clock_in)) {
    throw new ResponseError(
      "La hora de inicio del descanso no puede ser anterior a la entrada del fichaje.",
      400,
      "BREAK_STARTED_AT_BEFORE_CLOCK_IN",
    );
  }

  const createdId = await createFichajeBreak({
    fichaje_id: fichajeId,
    started_at: body.started_at,
  });

  return { id: createdId };
}
