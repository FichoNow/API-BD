import { isAfter } from "date-fns";
import { updateClockInById } from "../../../database/repositories/fichajes/fichaje-repository.js";
import { verifyFichajeOwnership } from "../../../helpers/fichaje-helper.js";
import { PatchClockInModifiedBody } from "../../../types/dto/user/fichajes/patch-clock-in-modified-body.js";
import { ResponseError } from "../../../types/express/response-type.js";

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
  const fichaje = await verifyFichajeOwnership(fichajeId, userId);

  if (fichaje.clock_out && isAfter(new Date(body.clock_in), new Date(fichaje.clock_out))) {
    throw new ResponseError(
      "La hora de entrada debe ser anterior a la hora de salida.",
      400,
      "INVALID_CLOCK_IN",
    );
  }

  await updateClockInById(fichajeId, { clock_in: body.clock_in, clock_in_modified: true });
}
