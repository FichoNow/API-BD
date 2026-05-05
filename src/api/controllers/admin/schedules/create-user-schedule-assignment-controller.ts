import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import {
  CreateUserScheduleAssignmentBody,
  CreateUserScheduleAssignmentBodySchema,
} from "../../../../types/dto/admin/schedules/create-user-schedule-assignment-body.js";
import { CreateUserScheduleAssignmentResponse } from "../../../../types/dto/admin/schedules/create-user-schedule-assignment-response.js";
import { createUserScheduleAssignmentService } from "../../../../services/admin/schedules/create-user-schedule-assignment-service.js";

/**
 * Controller del endpoint POST /admin/schedule/user-assignment.
 *
 * Su responsabilidad es:
 * 1. Validar el body recibido.
 * 2. Delegar la asignación individual de plantilla al service.
 * 3. Devolver 201 con la asignación creada.
 */
export async function createUserScheduleAssignmentController(
  req: Request<unknown, unknown, CreateUserScheduleAssignmentBody>,
  res: Response<BodyResponse<CreateUserScheduleAssignmentResponse>>,
) {
  const parsed = CreateUserScheduleAssignmentBodySchema.safeParse(req.body);

  if (!parsed.success) {
    throw new ResponseError(
      "Cuerpo de la solicitud inválido",
      400,
      "BAD_REQUEST",
    );
  }

  const data = await createUserScheduleAssignmentService(
    parsed.data as CreateUserScheduleAssignmentBody,
    req.jwtClaims!,
  );

  return res.status(201).json({ data });
}