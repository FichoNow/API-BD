import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { loginController } from "../controllers/auth/post-login-controller.js";
import { refreshController } from "../controllers/auth/post-refresh-controller.js";

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10, // máx 10 intentos por IP
  message: { error: "Demasiados intentos. Inténtalo de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post("/login", loginRateLimit, loginController); // Loguear un cliente

authRouter.post("/refresh", refreshController); // Obtener nuevo acces_token y refresh_token
