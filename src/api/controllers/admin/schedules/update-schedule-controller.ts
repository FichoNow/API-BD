import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import {
  UpdateScheduleBody,
  UpdateScheduleBodySchema,
} from "../../../../types/dto/admin/schedules/update-schedule-body.js";
import { UpdateScheduleResponse } from "../../../../types/dto/admin/schedules/update-schedule-response.js";
import { updateScheduleService } from "../../../../services/admin/schedules/update-schedule-service.js";

/**
 * Controller del endpoint PUT /admin/schedule/:id.
 *
 * Su responsabilidad es:
 * 1. Validar el id y el body recibido.
 * 2. Delegar la actualización de la plantilla al service.
 * 3. Devolver 200 con la plantilla actualizada.
 */
export async function updateScheduleController(
  req: Request<{ id: string }, unknown, UpdateScheduleBody>,
  res: Response<BodyResponse<UpdateScheduleResponse>>,
) {
  const templateId = Number(req.params.id);

  if (!Number.isInteger(templateId) || templateId <= 0) {
    throw new ResponseError(
      "ID de plantilla no válido",
      400,
      "INVALID_TEMPLATE_ID",
    );
  }

  const parsed = UpdateScheduleBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await updateScheduleService(
    templateId,
    parsed.data as UpdateScheduleBody,
    req.jwtClaims!,
  );

  return res.status(200).json({ data });
}
