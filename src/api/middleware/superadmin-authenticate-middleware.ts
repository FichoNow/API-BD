import type { Request, Response, NextFunction } from "express";
import { validateAccessToken } from "../../services/auth/access-token-service.js";
import { ResponseError } from "../../types/express/response-type.js";

export async function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.header("Authorization");
  if (!header) {
    return next(new ResponseError("Token inválido", 401, "MISSING_AUTH_HEADER"));
  }

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(new ResponseError("Token inválido", 401, "INVALID_AUTH_HEADER"));
  }

  const claims = validateAccessToken(token);
  req.jwtClaims = claims;

  if (claims.role !== "SUPERADMIN") {
    return next(new ResponseError("No autorizado", 403, "FORBIDDEN"));
  }

  return next();
}
