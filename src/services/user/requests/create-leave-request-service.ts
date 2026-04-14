import { createLeaveRequest } from "../../../database/repositories/requests/leave-request-repository.js";
import {
    findLeaveRequestStatusByCode,
    findLeaveRequestTypeByCode,
} from "../../../database/repositories/requests/leave-request-catalog-repository.js";
import { PostLeaveRequestBody } from "../../../types/dto/user/requests/post-leave-request-body.js";
import { PostLeaveRequestResponse } from "../../../types/dto/user/requests/post-leave-request-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Lógica de negocio para crear una solicitud de usuario.
 *
 * Qué hace este service:
 * 1. Comprueba que el tipo de solicitud existe en catálogo.
 * 2. Comprueba que el estado PENDING existe en catálogo.
 * 3. Valida reglas de fechas.
 * 4. Valida reglas específicas según el tipo de solicitud.
 * 5. Inserta la solicitud en la base de datos.
 * 6. Devuelve el id creado.
 */
export async function createLeaveRequestService(
    body: PostLeaveRequestBody,
    userId: number,
): Promise<PostLeaveRequestResponse> {
    // Buscamos el tipo de solicitud por su código (por ejemplo: VACATION).
    const leaveRequestType = await findLeaveRequestTypeByCode(body.type);

    // Si el tipo no existe, devolvemos error.
    if (!leaveRequestType) {
        throw new ResponseError(
            "Tipo de solicitud no encontrado.",
            404,
            "LEAVE_REQUEST_TYPE_NOT_FOUND",
        );
    }

    // Si el tipo existe pero está inactivo, no dejamos crear la solicitud.
    if (!leaveRequestType.is_active) {
        throw new ResponseError(
            "Tipo de solicitud inactivo.",
            400,
            "LEAVE_REQUEST_TYPE_INACTIVE",
        );
    }

    // Buscamos el estado PENDING, porque toda solicitud nueva debe crearse pendiente.
    const pendingStatus = await findLeaveRequestStatusByCode("PENDING");

    // Si por alguna razón no existe ese estado en la BD, algo está mal configurado.
    if (!pendingStatus) {
        throw new ResponseError(
            "Estado de solicitud PENDING no encontrado.",
            500,
            "LEAVE_REQUEST_STATUS_NOT_FOUND",
        );
    }

    // Validación de rango de fechas.
    validateDateRange(body.start_date, body.end_date);

    // Validaciones específicas según el tipo.
    validateLeaveRequestByType(body);

    // Insertamos la solicitud ya validada.
    const createdId = await createLeaveRequest({
        user_id: userId,
        type_id: leaveRequestType.id,
        start_date: body.start_date,
        end_date: body.end_date,
        start_time: body.start_time ?? null,
        end_time: body.end_time ?? null,
        comment: body.comment ?? null,
        status_id: pendingStatus.id,
    });

    // Devolvemos una respuesta mínima, siguiendo el estilo del proyecto.
    return { id: createdId };
}

/**
 * Valida que la fecha de fin no sea anterior a la fecha de inicio.
 */
function validateDateRange(startDate: string, endDate: string): void {
    if (endDate < startDate) {
        throw new ResponseError(
            "La fecha de fin no puede ser anterior a la fecha de inicio.",
            400,
            "LEAVE_REQUEST_INVALID_DATE_RANGE",
        );
    }
}

/**
 * Aplica las reglas específicas según el tipo de solicitud.
 */
function validateLeaveRequestByType(body: PostLeaveRequestBody): void {
    const startTime = body.start_time ?? null;
    const endTime = body.end_time ?? null;
    const hasTimes = startTime !== null && endTime !== null;
    const isSingleDay = body.start_date === body.end_date;

    switch (body.type) {
        case "VACATION":
            // Vacaciones: pueden ser uno o varios días, pero nunca por horas.
            if (hasTimes) {
                throw new ResponseError(
                    "Las vacaciones no permiten horas.",
                    400,
                    "VACATION_DOES_NOT_ALLOW_TIMES",
                );
            }
            return;

        case "SICK_LEAVE":
            // Baja médica: puede ser uno o varios días, pero nunca por horas.
            if (hasTimes) {
                throw new ResponseError(
                    "La baja por enfermedad no permite horas.",
                    400,
                    "SICK_LEAVE_DOES_NOT_ALLOW_TIMES",
                );
            }
            return;

        case "DAY_OFF":
            // Día libre: solo un día y sin horas.
            if (!isSingleDay) {
                throw new ResponseError(
                    "El día libre debe ser de un único día.",
                    400,
                    "DAY_OFF_MUST_BE_SINGLE_DAY",
                );
            }

            if (hasTimes) {
                throw new ResponseError(
                    "El día libre no permite horas.",
                    400,
                    "DAY_OFF_DOES_NOT_ALLOW_TIMES",
                );
            }
            return;

        case "MEDICAL_APPOINTMENT":
            // Cita médica: solo un día y con horas obligatorias.
            if (!isSingleDay) {
                throw new ResponseError(
                    "La cita médica debe ser de un único día.",
                    400,
                    "MEDICAL_APPOINTMENT_MUST_BE_SINGLE_DAY",
                );
            }

            if (!hasTimes) {
                throw new ResponseError(
                    "La cita médica requiere hora de inicio y hora de fin.",
                    400,
                    "MEDICAL_APPOINTMENT_REQUIRES_TIMES",
                );
            }
            return;

        case "PERMISSION":
            // Permiso: lo dejamos limitado a un único día.
            // Puede ir con horas o sin horas.
            if (!isSingleDay) {
                throw new ResponseError(
                    "El permiso debe ser de un único día.",
                    400,
                    "PERMISSION_MUST_BE_SINGLE_DAY",
                );
            }
            return;

        default:
            // Esto en teoría no debería pasar porque Zod ya valida el type,
            // pero lo dejamos por seguridad.
            throw new ResponseError(
                "Tipo de solicitud inválido.",
                400,
                "LEAVE_REQUEST_INVALID_TYPE",
            );
    }
}
