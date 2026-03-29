import { findFichajeById, updateClockOutById } from "../../database/repositories/fichaje-repository.js";
import { PatchClockOutBody } from "../../types/dto/user/patch-clock-out-body.js";
import { PatchClockOutResponse } from "../../types/dto/user/patch-clock-out-response.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para registrar la salida de un fichaje.
 * Comprueba que el fichaje existe y pertenece al usuario, y actualiza el clock_out.
 * @param fichajeId ID del fichaje a actualizar.
 * @param body Datos de la salida (clock_out).
 * @param userId ID del usuario autenticado (extraído del JWT).
 * @returns Los datos actualizados del fichaje.
 */
export async function updateClockOutService(
  fichajeId: number,
  body: PatchClockOutBody,
  userId: number,
): Promise<PatchClockOutResponse> {
  const fichaje = await findFichajeById(fichajeId);

  if (!fichaje || fichaje.user_id !== userId) {
    throw new ResponseError("Fichaje no encontrado.", 404, "FICHAJE_NOT_FOUND");
  }

  if (new Date(body.clock_out) <= new Date(fichaje.clock_in)) {
    throw new ResponseError(
      "La hora de salida debe ser posterior a la hora de entrada.",
      400,
      "INVALID_CLOCK_OUT",
    );
  }

  await updateClockOutById(fichajeId, { clock_out: body.clock_out });

  return {
    id: fichajeId,
    clock_out: body.clock_out,
  };
}
