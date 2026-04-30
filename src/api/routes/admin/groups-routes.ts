import { Router } from "express";
import { listGroupsController }   from "../../controllers/admin/groups/list-groups-controller.js";
import { createGroupController }  from "../../controllers/admin/groups/create-group-controller.js";
import { patchGroupController }   from "../../controllers/admin/groups/patch-group-controller.js";
import { deleteGroupController }  from "../../controllers/admin/groups/delete-group-controller.js";

export const groupsRouter = Router();

groupsRouter.get("/groups",         listGroupsController);
groupsRouter.post("/group",         createGroupController);
groupsRouter.patch("/group/:id",    patchGroupController);
groupsRouter.delete("/group/:id",   deleteGroupController);
