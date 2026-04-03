import { Router } from "express";
import { patchSelfController } from "../controllers/user/patch-user-controller.js";
import { logoutController } from "../controllers/user/delete-logout-controller.js";
import { postFichajeController } from "../controllers/user/post-fichaje-controller.js";
import { patchClockOutController } from "../controllers/user/patch-clock-out-controller.js";
import { patchClockOutModifiedController } from "../controllers/user/patch-clock-out-modified-controller.js";
import { patchClockInModifiedController } from "../controllers/user/patch-clock-in-modified-controller.js";
import { getFichajesController } from "../controllers/user/get-fichajes-controller.js";
import { deleteFichajeController } from "../controllers/user/delete-fichaje-controller.js";
import { postFichajeEntryController } from "../controllers/user/post-fichaje-entry-controller.js";

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
