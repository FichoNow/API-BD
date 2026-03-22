import type { Request, Response, NextFunction } from "express";
import { validateAccessToken } from "../../services/auth/access-token-service.js";
import { ResponseError } from "../../types/express/response-type.js";

/**
 * Middleware que protege rutas exclusivas de administradores.
 *
 * Lee el token del header Authorization, lo valida y mete los datos del usuario en req.jwtClaims.
 * Si no hay token, es inválido, o el usuario no tiene rol ADMINISTRATOR, pasa un error al siguiente middleware.
 *
 * @param req - Petición HTTP (debe incluir header Authorization: Bearer <token>).
 * @param res - Respuesta HTTP (no se usa directamente aquí).
 * @param next - Función para pasar al siguiente middleware o al manejador de errores.
 */
export async function requireAdministrator(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.header("Authorization");
  if (!header) {
    return next(new ResponseError("No autorizado", 401, "MISSING_AUTH_HEADER"));
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(new ResponseError("No autorizado", 401, "INVALID_AUTH_HEADER"));
  }

  const claims = validateAccessToken(token);
  req.jwtClaims = claims;

  if (claims.role !== "ADMINISTRATOR") {
    return next(new ResponseError("No autorizado", 403, "FORBIDDEN"));
  }

  console.log(claims);

  return next();
}
