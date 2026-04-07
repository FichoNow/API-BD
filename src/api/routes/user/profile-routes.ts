import { Router } from "express";
import { patchSelfController } from "../../controllers/user/profile/patch-user-controller.js";
import { logoutController } from "../../controllers/user/profile/delete-logout-controller.js";

export const profileRouter = Router();

profileRouter.patch("/update", patchSelfController);
profileRouter.delete("/logout", logoutController);
