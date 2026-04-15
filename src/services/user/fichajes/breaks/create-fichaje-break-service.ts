import {
  createFichajeBreak,
  findOpenBreakByFichajeId,
} from "../../../../database/repositories/fichajes/fichaje-break-repository.js";
import { startOfMinute } from "date-fns";
import { verifyFichajeOwnership } from "../../../../helpers/fichaje-helper.js";
import { PostFichajeBreakBody } from "../../../../types/dto/user/fichajes/breaks/post-fichaje-break-body.js";
import { PostFichajeBreakResponse } from "../../../../types/dto/user/fichajes/breaks/post-fichaje-break-response.js";
import { ResponseError } from "../../../../types/express/response-type.js";

/**
 * Lógica de negocio para iniciar un descanso dentro de un fichaje activo.
 * Comprueba que el fichaje pertenece al usuario, que está abierto (sin clock_out),
 * que no hay ya un descanso activo y que la hora de inicio es válida.
 *
 * @param fichajeId ID del fichaje al que pertenece el descanso.
 * @param body Cuerpo de la petición con la hora de inicio del descanso.
 * @param userId ID del usuario autenticado.
 * @returns ID del nuevo descanso creado.
 */
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

  if (body.started_at < startOfMinute(fichaje.clock_in)) {
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
