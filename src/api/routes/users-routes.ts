import { Router } from "express";
import { createUserController } from "../controllers/create-user-controller.js";

/**
 * Router encargado de las rutas relacionadas con usuarios.
 */
export const usersRouter = Router();

/**
 * Endpoint para crear un usuario nuevo.
 */
usersRouter.post("/users", createUserController);

