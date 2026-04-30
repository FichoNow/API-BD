import { Request, Response } from "express";
import { BodyResponse, ResponseError } from "../../../../types/express/response-type.js";
import {
  ReviewRequestBody,
  ReviewRequestBodySchema,
} from "../../../../types/dto/admin/review-request-body.js";
import { ReviewRequestResponse } from "../../../../types/dto/admin/review-request-response.js";
import { approveRequestService } from "../../../../services/admin/requests/approve-request-service.js";

/**
 * Controller del endpoint PATCH /admin/requests/:id/approve.
 *
 * Su responsabilidad es:
 * 1. Leer y validar el ID de la solicitud desde params.
 * 2. Validar el body con el comentario de revisión.
 * 3. Delegar al service `approveRequestService`.
 * 4. Devolver 200 con la solicitud aprobada.
 */
export async function approveRequestController(
  req: Request<{ id: string }, unknown, ReviewRequestBody>,
  res: Response<BodyResponse<ReviewRequestResponse>>,
) {
  const requestId = Number(req.params.id);

  if (!Number.isInteger(requestId) || requestId <= 0) {
    throw new ResponseError(
      "ID de solicitud no válido",
      400,
      "INVALID_REQUEST_ID",
    );
  }

  const parsed = ReviewRequestBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await approveRequestService(
    requestId,
    parsed.data as ReviewRequestBody,
    req.jwtClaims!,
  );

  return res.status(200).json({ data });
}