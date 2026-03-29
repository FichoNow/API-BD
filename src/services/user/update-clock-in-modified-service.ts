import { findFichajeById, updateClockInById } from "../../database/repositories/fichaje-repository.js";
import { PatchClockInModifiedBody } from "../../types/dto/user/patch-clock-in-modified-body.js";
import { PatchClockInModifiedResponse } from "../../types/dto/user/patch-clock-in-modified-response.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Lógica de negocio para corregir la hora de entrada de un fichaje.
 * Comprueba que el fichaje existe y pertenece al usuario, actualiza el clock_in
 * y marca clock_in_modified como true internamente.
 * @param fichajeId ID del fichaje a actualizar.
 * @param body Datos de la corrección (time en formato HH:mm).
 * @param userId ID del usuario autenticado (extraído del JWT).
 * @returns Los datos actualizados del fichaje.
 */
export async function updateClockInModifiedService(
  fichajeId: number,
  body: PatchClockInModifiedBody,
  userId: number,
): Promise<PatchClockInModifiedResponse> {
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

  return {
    id: fichajeId,
    clock_in: body.clock_in,
    clock_in_modified: true,
  };
}
