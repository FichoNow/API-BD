import { Router } from "express";
import { postFichajeController } from "../../../controllers/user/fichajes/post-fichaje-controller.js";
import { deleteFichajeController } from "../../../controllers/user/fichajes/delete-fichaje-controller.js";
import { patchClockOutController } from "../../../controllers/user/fichajes/patch-clock-out-controller.js";
import { patchClockInModifiedController } from "../../../controllers/user/fichajes/patch-clock-in-modified-controller.js";
import { patchClockOutModifiedController } from "../../../controllers/user/fichajes/patch-clock-out-modified-controller.js";
import { getFichajesController } from "../../../controllers/user/fichajes/get-fichajes-controller.js";
import { entryRouter } from "./entry-routes.js";
import { breakRouter } from "./break-routes.js";

export const fichajeRouter = Router();

fichajeRouter.post("/", postFichajeController);
fichajeRouter.delete("/:id", deleteFichajeController);
fichajeRouter.patch("/:id/clock-out", patchClockOutController);
fichajeRouter.patch("/:id/clock-in/modified", patchClockInModifiedController);
fichajeRouter.patch("/:id/clock-out/modified", patchClockOutModifiedController);
fichajeRouter.get("/", getFichajesController);
fichajeRouter.use("/:id/entries", entryRouter);
fichajeRouter.use("/:id/breaks", breakRouter);
