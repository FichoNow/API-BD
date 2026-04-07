import { createFichajeEntry } from "../../../../database/repositories/fichaje-entry-repository.js";
import { findProjectById } from "../../../../database/repositories/project-repository.js";
import { verifyFichajeOwnership, toMinute } from "../../../../helpers/fichaje-helper.js";
import { PostFichajeEntryBody } from "../../../../types/dto/user/fichajes/entries/post-fichaje-entry-body.js";
import { PostFichajeEntryResponse } from "../../../../types/dto/user/fichajes/entries/post-fichaje-entry-response.js";
import { ResponseError } from "../../../../types/express/response-type.js";

/**
 * Lógica de negocio para crear una nueva entry dentro de un fichaje.
 * Comprueba que el fichaje existe y pertenece al usuario, y que el proyecto existe.
 * @param fichajeId ID del fichaje donde se añadirá la entry.
 * @param body Datos de la nueva entry.
 * @param userId ID del usuario autenticado.
 * @returns Los datos de la entry creada.
 */
export async function createFichajeEntryService(
    fichajeId: number,
    body: PostFichajeEntryBody,
    userId: number,
): Promise<PostFichajeEntryResponse> {
    const fichaje = await verifyFichajeOwnership(fichajeId, userId);

    const project = await findProjectById(body.project_id);

    if(!project){
        throw new ResponseError("Projecto no encontrado.", 404, "PROJECT_NOT_FOUND");
    }

    if (body.started_at < toMinute(fichaje.clock_in)) {
        throw new ResponseError(
            "La hora de inicio no puede ser anterior a la entrada del fichaje.",
            400,
            "ENTRY_STARTED_AT_BEFORE_CLOCK_IN",
        );
    }

    if (fichaje.clock_out !== null && body.started_at > toMinute(fichaje.clock_out)) {
        throw new ResponseError(
            "La hora de inicio no puede ser posterior a la salida del fichaje.",
            400,
            "ENTRY_STARTED_AT_AFTER_CLOCK_OUT",
        );
    }

    const createdId = await createFichajeEntry({
        fichaje_id: fichajeId,
        project_id: body.project_id,
        started_at: body.started_at,
    });

    return { id: createdId };
}