import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { loginController } from "../controllers/auth/post-login-controller.js";
import { refreshController } from "../controllers/auth/post-refresh-controller.js";
import { registerController } from "../controllers/auth/post-register-controller.js";

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 50, // máx 50 intentos por IP
  message: { error: "Demasiados intentos. Inténtalo de nuevo en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 30, // máx 30 registros por IP
  message: { error: "Demasiados intentos. Inténtalo de nuevo en 1 hora." },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRouter = Router();

authRouter.post("/login", loginRateLimit, loginController); // Loguear un cliente

authRouter.post("/refresh", refreshController); // Obtener nuevo acces_token y refresh_token

authRouter.post("/register", registerRateLimit, registerController); // Registrar nueva empresa + SUPERADMIN
