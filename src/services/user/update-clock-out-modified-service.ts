import { findFichajeById, updateClockOutModifiedById } from "../../database/repositories/fichaje-repository.js";
import { PatchClockOutModifiedBody } from "../../types/dto/user/patch-clock-out-modified-body.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para corregir la hora de salida de un fichaje.
 * @param fichajeId ID del fichaje a actualizar.
 * @param body Datos de la corrección (clock_out).
 * @param userId ID del usuario autenticado (extraído del JWT).
 */
export async function updateClockOutModifiedService(
  fichajeId: number,
  body: PatchClockOutModifiedBody,
  userId: number,
): Promise<void> {
  const fichaje = await findFichajeById(fichajeId);

  if (!fichaje || fichaje.user_id !== userId) {
    throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
  }

  if (!fichaje.clock_out) {
    throw new ResponseError("El fichaje no tiene hora de salida registrada.", 400, "CLOCK_OUT_NOT_SET");
  }

  if (new Date(body.clock_out) <= new Date(fichaje.clock_in)) {
    throw new ResponseError(
      "La hora de salida debe ser posterior a la hora de entrada.",
      400,
      "INVALID_CLOCK_OUT",
    );
  }

  await updateClockOutModifiedById(fichajeId, {
    clock_out: body.clock_out,
    clock_out_modified: true,
  });
}
