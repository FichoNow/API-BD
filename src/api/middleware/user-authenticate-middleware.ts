import type { Request, Response, NextFunction } from "express";
import { validateAccesToken } from "../../services/acces-token-service.js";
import { AppError } from "../../types/error/app-error-type.js";

/**
 * Middleware que protege rutas privadas.
 *
 * Lee el token del header Authorization, lo valida y mete los datos del usuario en req.JwtClaims.
 * Si no hay token o es inválido, pasa un error al siguiente middleware.
 *
 * @param req - Petición HTTP (debe incluir header Authorization: Bearer <token>).
 * @param res - Respuesta HTTP (no se usa directamente aquí).
 * @param next - Función para pasar al siguiente middleware o al manejador de errores.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.header("Authorization");
  if (!header) {
    return next(new AppError("No autorizado", 401, "MISSING_AUTH_HEADER"));
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(new AppError("No autorizado", 401, "INVALID_AUTH_HEADER"));
  }

  req.jwtClaims = validateAccesToken(token);

  if (req.jwtClaims.role !== "ADMINISTRATOR" && req.jwtClaims.role !== "USER") {
    return next(new AppError("No autorizado", 401, "INVALID_AUTH_HEADER"));
  }

  console.log(req.jwtClaims);

  return next();
}
