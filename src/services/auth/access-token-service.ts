import jwt from "jsonwebtoken";
import { env } from "../../config-env.js";
import { ResponseError } from "../../types/express/response-type.js";
import { JwtClaims } from "../../types/dto/jwt/jwt-claims-dto.js";

/**
 * Genera y firma un JWT con los claims del usuario.
 *
 * @param jwtClaims - Datos del usuario que se incluyen en el token.
 * @returns Token JWT firmado.
 *
 * Configuración:
 * - payload: { jwtClaims }
 * - subject: jwtClaims.id  //ID del usuario
 * - expiresIn: JWT_ACCESS_EXPIRES_IN segundos (por defecto 900 = 15 minutos)
 * - issuer / audience: metadata del token
 */
export function issueJwt(jwtClaims: JwtClaims): string {
  return jwt.sign({ jwtClaims }, env.JWT_SECRET, {
    subject: jwtClaims.id.toString(),
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: "Api-Fran-Jan",
    audience: "FichajeApp-client",
  });
}

/**
 * Verifica que el token sea válido y devuelve los datos del usuario que contiene.
 *
 * @param token - Token JWT del header Authorization.
 * @returns Los claims del usuario si el token es válido.
 * @throws ResponseError si el token ha expirado, es inválido o no tiene el formato esperado.
 */
export function validateAccessToken(token: string): JwtClaims {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: "Api-Fran-Jan",
      audience: "FichajeApp-client",
    });

    if (typeof decoded === "string" || !decoded.jwtClaims) {
      throw new ResponseError("No autorizado", 401, "INVALID_TOKEN_PAYLOAD");
    }

    return decoded.jwtClaims;
  } catch (err) {
    if (err instanceof ResponseError) throw err;
    if (err instanceof jwt.TokenExpiredError) {
      throw new ResponseError("Token expirado", 401, "TOKEN_EXPIRED");
    }
    throw new ResponseError("No autorizado", 401, "UNAUTHORIZED");
  }
}
