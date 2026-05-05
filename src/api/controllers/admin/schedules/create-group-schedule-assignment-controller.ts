import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import {
  CreateGroupScheduleAssignmentBody,
  CreateGroupScheduleAssignmentBodySchema,
} from "../../../../types/dto/admin/schedules/create-group-schedule-assignment-body.js";
import { CreateGroupScheduleAssignmentResponse } from "../../../../types/dto/admin/schedules/create-group-schedule-assignment-response.js";
import { createGroupScheduleAssignmentService } from "../../../../services/admin/schedules/create-group-schedule-assignment-service.js";

/**
 * Controller del endpoint POST /admin/schedule/group-assignment.
 *
 * Su responsabilidad es:
 * 1. Validar el body recibido.
 * 2. Delegar la asignación de plantilla al service.
 * 3. Devolver 201 con la asignación creada.
 */
export async function createGroupScheduleAssignmentController(
  req: Request<unknown, unknown, CreateGroupScheduleAssignmentBody>,
  res: Response<BodyResponse<CreateGroupScheduleAssignmentResponse>>,
) {
  const parsed = CreateGroupScheduleAssignmentBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await createGroupScheduleAssignmentService(
    parsed.data as CreateGroupScheduleAssignmentBody,
    req.jwtClaims!,
  );

  return res.status(201).json({ data });
}