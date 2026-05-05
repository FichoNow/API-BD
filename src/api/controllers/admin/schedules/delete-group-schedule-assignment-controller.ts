import { Request, Response } from "express";
import {
  BodyResponse,
  ResponseError,
} from "../../../../types/express/response-type.js";
import { deleteGroupScheduleAssignmentService } from "../../../../services/admin/schedules/delete-group-schedule-assignment-service.js";
import { DeleteScheduleAssignmentResponse } from "../../../../types/dto/admin/schedules/delete-schedule-assignment-response.js";

/**
 * Controller del endpoint DELETE /admin/schedule/group-assignment/:id.
 */
export async function deleteGroupScheduleAssignmentController(
  req: Request<{ id: string }>,
  res: Response<BodyResponse<DeleteScheduleAssignmentResponse>>,
) {
  const assignmentId = Number(req.params.id);

  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    throw new ResponseError(
      "ID de asignación no válido",
      400,
      "INVALID_ASSIGNMENT_ID",
    );
  }

  const data = await deleteGroupScheduleAssignmentService(
    assignmentId,
    req.jwtClaims!,
  );

  return res.status(200).json({ data });
}
