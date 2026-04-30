import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findUserById } from "../../../database/repositories/user-repository.js";
import {
    findLeaveRequestById,
    reviewLeaveRequestById,
} from "../../../database/repositories/requests/leave-request-repository.js";
import {
    findLeaveRequestStatusByCode,
    findLeaveRequestTypeById,
} from "../../../database/repositories/requests/leave-request-catalog-repository.js";
import { findTipoExcepcionByCode } from "../../../database/repositories/horarios/tipo-excepcion-repository.js";
import { createExcepcionCalendario } from "../../../database/repositories/horarios/excepcion-calendario-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ReviewRequestBody } from "../../../types/dto/admin/review-request-body.js";
import { ReviewRequestResponse } from "../../../types/dto/admin/review-request-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

/**
 * Aprueba una solicitud de ausencia desde el panel admin.
 *
 * Reglas:
 * - La solicitud debe existir.
 * - El usuario de la solicitud debe existir.
 * - La solicitud debe pertenecer a la misma empresa del admin.
 * - ADMINISTRATOR solo puede revisar solicitudes de su departamento.
 * - La solicitud debe estar en estado PENDING.
 * - Al aprobar, se crea una excepción de calendario asociada a la solicitud.
 */
export async function approveRequestService(
    requestId: number,
    body: ReviewRequestBody,
    claims: JwtClaims,
): Promise<ReviewRequestResponse> {
    const leaveRequest = await findLeaveRequestById(requestId);

    if (!leaveRequest) {
        throw new ResponseError(
            "Solicitud no encontrada",
            404,
            "REQUEST_NOT_FOUND",
        );
    }

    const user = await findUserById(leaveRequest.user_id);

    if (!user) {
        throw new ResponseError(
            "Usuario de la solicitud no encontrado",
            404,
            "USER_NOT_FOUND",
        );
    }

    const department = await findDepartmentById(user.department_id);

    if (!department || department.company_id !== claims.company_id) {
        throw new ResponseError(
            "Solicitud no encontrada",
            404,
            "REQUEST_NOT_FOUND",
        );
    }

    if (claims.role === "ADMINISTRATOR" && claims.department_id !== user.department_id) {
        throw new ResponseError("No autorizado", 403, "FORBIDDEN");
    }

    const [pendingStatus, approvedStatus] = await Promise.all([
        findLeaveRequestStatusByCode("PENDING"),
        findLeaveRequestStatusByCode("APPROVED"),
    ]);

    if (!pendingStatus || !approvedStatus) {
        throw new ResponseError(
            "Estados de solicitud no configurados",
            500,
            "REQUEST_STATUS_NOT_CONFIGURED",
        );
    }

    if (leaveRequest.status_id !== pendingStatus.id) {
        throw new ResponseError(
            "Solo se pueden aprobar solicitudes pendientes",
            409,
            "REQUEST_NOT_PENDING",
        );
    }

    const leaveRequestType = await findLeaveRequestTypeById(leaveRequest.type_id);

    if (!leaveRequestType) {
        throw new ResponseError(
            "Tipo de solicitud no configurado",
            500,
            "REQUEST_TYPE_NOT_CONFIGURED",
        );
    }

    const tipoExcepcion = await findTipoExcepcionByCode(leaveRequestType.code);

    if (!tipoExcepcion) {
        throw new ResponseError(
            "Tipo de excepción no configurado",
            500,
            "EXCEPTION_TYPE_NOT_CONFIGURED",
        );
    }

    const reviewComment = body.review_comment?.trim() || null;

    const updated = await reviewLeaveRequestById(
        requestId,
        approvedStatus.id,
        claims.id,
        reviewComment,
    );

    if (!updated) {
        throw new ResponseError(
            "Error al aprobar la solicitud",
            500,
            "REQUEST_APPROVE_FAILED",
        );
    }

    await createExcepcionCalendario({
        department_id: user.department_id,
        user_id: user.id,
        group_id: null,
        tipo_id: tipoExcepcion.id,
        leave_request_id: requestId,
        title: buildExceptionTitle(tipoExcepcion.name),
        start_date: formatDateOnly(leaveRequest.start_date),
        end_date: formatDateOnly(leaveRequest.end_date),
        start_time: leaveRequest.start_time,
        end_time: leaveRequest.end_time,
        notes: reviewComment,
        created_by: claims.id,
    });

    return {
        id: requestId,
        status: "APPROVED",
        reviewed_by: claims.id,
        reviewed_at: new Date(),
        review_comment: reviewComment,
    };
}

/**
 * Convierte un Date de MySQL en yyyy-MM-dd.
 */
function formatDateOnly(date: Date): string {
    return date.toISOString().slice(0, 10);
}

/**
 * Construye el título que se guardará en excepciones_calendario.
 */
function buildExceptionTitle(tipoName: string): string {
    return tipoName;
}