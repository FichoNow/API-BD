import { Router } from "express";
import { getUsersController }       from "../../controllers/admin/users/get-users-controller.js";
import { createUserController }     from "../../controllers/admin/users/create-user-controller.js";
import { createUsersController }    from "../../controllers/admin/users/create-users-controller.js";
import { patchUserController }      from "../../controllers/admin/users/patch-user-controller.js";
import { deleteUserController }     from "../../controllers/admin/users/delete-user-controller.js";

export const usersRouter = Router();

usersRouter.get("/users",       getUsersController);
usersRouter.post("/user",       createUserController);
usersRouter.post("/users",      createUsersController);
usersRouter.patch("/user/:id",  patchUserController);
usersRouter.delete("/user/:id", deleteUserController);
