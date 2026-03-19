import "dotenv/config";
import jwt from "jsonwebtoken";
import { JwtClaims } from "../types/dto/JWT/jwt-claims-dto.js";
import { AppError } from "../types/error/app-error-type.js";
import { env } from "../config-env.js";

/**
 * Emite un JWT con los claims del usuario.
 *
 * @param jwtClaims - Claims (información del usuario)
 * @returns Token JWT firmado (string).
 */
export function issueJwt(jwtClaims: JwtClaims): string {
  return generateJwt(jwtClaims);
}

/**
 * Genera y firma un JWT con los claims del usuario.
 *
 * @param jwtClaims - (información del usuario)
 * @returns Token JWT firmado.
 *
 * Configuración:
 * - payload: { jwtClaims }
 * - subject: jwtClaims.id  //ID del usuario
 * - expiresIn: 15 minutos
 * - issuer / audience: metadata del token
 */
export function generateJwt(jwtClaims: JwtClaims): string {
  return jwt.sign({ jwtClaims }, env.JWT_SECRET, {
    subject: jwtClaims.id.toString(),
    expiresIn: "15m",
    issuer: "Api-Fran-Jan",
    audience: "FichajeApp-client",
  });
}

/**
 * Verifica que el token sea válido y devuelve los datos del usuario que contiene.
 *
 * @param token - Token JWT del header Authorization.
 * @returns Los claims del usuario si el token es válido.
 * @throws AppError si el token ha expirado, es inválido o no tiene el formato esperado.
 */
export function validateAccesToken(token: string): JwtClaims {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET, {
      issuer: "Api-Fran-Jan",
      audience: "FichajeApp-client",
    });

    if (typeof decoded === "string" || !decoded.jwtClaims) {
      throw new AppError("No autorizado", 401, "INVALID_TOKEN_PAYLOAD");
    }

    return decoded.jwtClaims;
  } catch (err) {
    if (err instanceof AppError) throw err; // Por si lannzamos el error de arriba de no autorizado
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expirado", 401, "TOKEN_EXPIRED");
    }
    if (err instanceof jwt.JsonWebTokenError) {
      throw new AppError("Token inválido", 401, "TOKEN_INVALID");
    }
    throw new AppError("No autorizado", 401, "UNAUTHORIZED");
  }
}
