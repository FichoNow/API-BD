import { findFichajeById, updateClockInById } from "../../database/repositories/fichaje-repository.js";
import { PatchClockInModifiedBody } from "../../types/dto/user/patch-clock-in-modified-body.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para corregir la hora de entrada de un fichaje.
 * @param fichajeId ID del fichaje a actualizar.
 * @param body Datos de la corrección (clock_in).
 * @param userId ID del usuario autenticado (extraído del JWT).
 */
export async function updateClockInModifiedService(
  fichajeId: number,
  body: PatchClockInModifiedBody,
  userId: number,
): Promise<void> {
  const fichaje = await findFichajeById(fichajeId);

  if (!fichaje || fichaje.user_id !== userId) {
    throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
  }

  if (fichaje.clock_out && new Date(body.clock_in) >= new Date(fichaje.clock_out)) {
    throw new ResponseError(
      "La hora de entrada debe ser anterior a la hora de salida.",
      400,
      "INVALID_CLOCK_IN",
    );
  }

  await updateClockInById(fichajeId, { clock_in: body.clock_in, clock_in_modified: true });
}
