import { Router } from "express";
import { getSchedulesController } from "../../controllers/admin/schedules/get-schedules-controller.js";
import { createScheduleController } from "../../controllers/admin/schedules/create-schedule-controller.js";
import { createGroupScheduleAssignmentController } from "../../controllers/admin/schedules/create-group-schedule-assignment-controller.js";
import { createUserScheduleAssignmentController } from "../../controllers/admin/schedules/create-user-schedule-assignment-controller.js";

export const schedulesRouter = Router();

schedulesRouter.get("/schedules", getSchedulesController); // Listar plantillas de horario de un departamento
schedulesRouter.post("/schedule", createScheduleController); // Crear una plantilla de horario
schedulesRouter.post("/schedule/group-assignment", createGroupScheduleAssignmentController,); // Asignar una plantilla de horario a un grupo
schedulesRouter.post("/schedule/user-assignment", createUserScheduleAssignmentController,); // Asignar una plantilla de horario a un usuario.