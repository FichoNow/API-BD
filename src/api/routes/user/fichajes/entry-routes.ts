import { Router } from "express";
import { postFichajeEntryController } from "../../../controllers/user/fichajes/entries/post-fichaje-entry-controller.js";
import { getFichajeEntriesController } from "../../../controllers/user/fichajes/entries/get-fichaje-entries-controller.js";
import { patchFichajeEntryEndController } from "../../../controllers/user/fichajes/entries/patch-fichaje-entry-end-controller.js";
import { patchFichajeEntryStartController } from "../../../controllers/user/fichajes/entries/patch-fichaje-entry-start-controller.js";
import { patchFichajeEntryProjectController } from "../../../controllers/user/fichajes/entries/patch-fichaje-entry-project-controller.js";

export const entryRouter = Router({ mergeParams: true });

entryRouter.post("/", postFichajeEntryController);
entryRouter.get("/", getFichajeEntriesController);
entryRouter.patch("/:entryId/end", patchFichajeEntryEndController);
entryRouter.patch("/:entryId/start", patchFichajeEntryStartController);
entryRouter.patch("/:entryId/project", patchFichajeEntryProjectController);
