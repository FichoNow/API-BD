import { Router } from "express";
import { patchSelfController } from "../controllers/user/profile/patch-user-controller.js";
import { logoutController } from "../controllers/user/profile/delete-logout-controller.js";
import { postFichajeController } from "../controllers/user/fichajes/post-fichaje-controller.js";
import { patchClockOutController } from "../controllers/user/fichajes/patch-clock-out-controller.js";
import { patchClockOutModifiedController } from "../controllers/user/fichajes/patch-clock-out-modified-controller.js";
import { patchClockInModifiedController } from "../controllers/user/fichajes/patch-clock-in-modified-controller.js";
import { getFichajesController } from "../controllers/user/fichajes/get-fichajes-controller.js";
import { deleteFichajeController } from "../controllers/user/fichajes/delete-fichaje-controller.js";
import { postFichajeEntryController } from "../controllers/user/fichaje-entries/post-fichaje-entry-controller.js";
import { patchFichajeEntryEndController } from "../controllers/user/fichaje-entries/patch-fichaje-entry-end-controller.js";
import { patchFichajeEntryStartController } from "../controllers/user/fichaje-entries/patch-fichaje-entry-start-controller.js";
import { getFichajeEntriesController } from "../controllers/user/fichaje-entries/get-fichaje-entries-controller.js";
import { getProjectsController } from "../controllers/user/projects/get-projects-controller.js";

export const userRouter = Router();

userRouter.patch("/update", patchSelfController); // Actualizar el propio cliente

userRouter.delete("/logout", logoutController); // Logout de la cuenta del cliente

userRouter.post("/fichaje", postFichajeController); // Iniciar un fichaje

userRouter.delete("/fichaje/:id", deleteFichajeController); // Eliminar un fichaje propio

userRouter.patch("/fichaje/:id/clock-out", patchClockOutController); // Registrar la salida de un fichaje

userRouter.patch("/fichaje/:id/clock-in/modified", patchClockInModifiedController); // Corregir la hora de entrada de un fichaje
userRouter.patch("/fichaje/:id/clock-out/modified", patchClockOutModifiedController); // Corregir la hora de salida de un fichaje

userRouter.get("/fichajes", getFichajesController); // Obtener los fichajes del usuario autenticado.

userRouter.post("/fichajes/:id/entries", postFichajeEntryController);   // Crear un bloque de proyecto dentro de un fichaje.

userRouter.patch("/fichajes/:id/entries/:entryId/end", patchFichajeEntryEndController);
userRouter.patch("/fichajes/:id/entries/:entryId/start", patchFichajeEntryStartController);    // Cerrar un bloque de proyecto dentro de un fichaje.

userRouter.get("/fichajes/:id/entries", getFichajeEntriesController);   // Obtener las entries de un fichaje concreto.

userRouter.get("/projects", getProjectsController);   // Obtener los proyectos visibles para el usuario autenticado.