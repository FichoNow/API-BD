import { Router } from "express";
import { getSchedulesController } from "../../controllers/admin/schedules/get-schedules-controller.js";
import { createScheduleController } from "../../controllers/admin/schedules/create-schedule-controller.js";
import { updateScheduleController } from "../../controllers/admin/schedules/update-schedule-controller.js";
import { createGroupScheduleAssignmentController } from "../../controllers/admin/schedules/create-group-schedule-assignment-controller.js";
import { createUserScheduleAssignmentController } from "../../controllers/admin/schedules/create-user-schedule-assignment-controller.js";
import { getScheduleAssignmentsController } from "../../controllers/admin/schedules/get-schedule-assignments-controller.js";
import { deleteUserScheduleAssignmentController } from "../../controllers/admin/schedules/delete-user-schedule-assignment-controller.js";
import { deleteGroupScheduleAssignmentController } from "../../controllers/admin/schedules/delete-group-schedule-assignment-controller.js";

export const schedulesRouter = Router();

schedulesRouter.get("/schedules", getSchedulesController); // Listar plantillas de horario de un departamento
schedulesRouter.post("/schedule", createScheduleController); // Crear una plantilla de horario
schedulesRouter.put("/schedule/:id", updateScheduleController); // Editar una plantilla de horario existente
schedulesRouter.get("/schedule/assignments", getScheduleAssignmentsController); // Listar asignaciones (usuario y grupo) de un departamento
schedulesRouter.post("/schedule/group-assignment", createGroupScheduleAssignmentController); // Asignar una plantilla de horario a un grupo
schedulesRouter.post("/schedule/user-assignment", createUserScheduleAssignmentController); // Asignar una plantilla de horario a un usuario
schedulesRouter.delete("/schedule/user-assignment/:id", deleteUserScheduleAssignmentController); // Borrar una asignación de horario de usuario
schedulesRouter.delete("/schedule/group-assignment/:id", deleteGroupScheduleAssignmentController); // Borrar una asignación de horario de grupo
