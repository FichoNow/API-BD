import { Router } from "express";
import { postFichajeBreakController } from "../../../controllers/user/fichajes/breaks/post-fichaje-break-controller.js";
import { patchFichajeBreakEndController } from "../../../controllers/user/fichajes/breaks/patch-fichaje-break-end-controller.js";

export const breakRouter = Router({ mergeParams: true });

breakRouter.post("/", postFichajeBreakController);
breakRouter.patch("/:breakId/end", patchFichajeBreakEndController);
