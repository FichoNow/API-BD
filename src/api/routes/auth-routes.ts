import { Router } from "express";
import { loginController } from "../controllers/login-controller.js";

export const authRouter = Router();

console.log("DEBUG: auth-routes.ts cargado");

authRouter.post("/login", loginController);

console.log("DEBUG: ruta POST /auth/login registrada");
