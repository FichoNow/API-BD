import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import {
  CreateScheduleBody,
  CreateScheduleBodySchema,
} from "../../../../types/dto/admin/schedules/create-schedule-body.js";
import { CreateScheduleResponse } from "../../../../types/dto/admin/schedules/create-schedule-response.js";
import { createScheduleService } from "../../../../services/admin/schedules/create-schedule-service.js";

/**
 * Controller del endpoint POST /admin/schedule.
 *
 * Su responsabilidad es:
 * 1. Validar el body recibido.
 * 2. Delegar la creación de la plantilla al service.
 * 3. Devolver 201 con la plantilla creada.
 */
export async function createScheduleController(
  req: Request<unknown, unknown, CreateScheduleBody>,
  res: Response<BodyResponse<CreateScheduleResponse>>,
) {
  const parsed = CreateScheduleBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await createScheduleService(
    parsed.data as CreateScheduleBody,
    req.jwtClaims!,
  );

  return res.status(201).json({ data });
}