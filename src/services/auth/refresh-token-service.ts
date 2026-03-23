import crypto from "crypto";
import { env } from "../../config-env.js";
import {
  createRefreshToken,
  findRefreshTokenByHash,
} from "../../database/repositories/refresh-token-repository.js";
import { ResponseError } from "../../types/express/response-type.js";
import { UserRow } from "../../types/db/user-row-type.js";
import { findUserById } from "../../database/repositories/user-repository.js";
import { findCompanyById } from "../../database/repositories/company-repository.js";

/**
 * Emite un refresh token para un cliente:
 * - genera token opaco
 * - calcula hash
 * - guarda hash + expiración en BD
 * - devuelve el token en claro
 *
 * @param userId - ID del usuario previamente validado.
 * @returns Refresh token en claro (para el cliente).
 */
export async function issueRefreshToken(userId: number): Promise<string> {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = getRefreshTokenExpiresAt();

  await createRefreshToken({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  return refreshToken;
}

/**
 * Valida un refresh token.
 *
 * @param refreshToken - Token del cliente.
 *
 * @returns Datos completos del usuario validado.
 */
export async function validateRefreshToken(
  refreshToken: string,
): Promise<UserRow> {
  const tokenHash = hashRefreshToken(refreshToken);

  const dataRefreshToken = await findRefreshTokenByHash(tokenHash);

  if (!dataRefreshToken) {
    throw new ResponseError("Token inválido", 401, "UNAUTHORIZED");
  }

  if (new Date() > new Date(dataRefreshToken.expires_at)) {
    throw new ResponseError("Token expirado", 401, "TOKEN_EXPIRED");
  }

  const dataUser = await findUserById(dataRefreshToken.user_id);

  if (!dataUser || !dataUser.is_active) {
    throw new ResponseError("Token inválido", 401, "UNAUTHORIZED");
  }

  const company = await findCompanyById(dataUser.company_id);

  if (!company || !company.is_active) {
    throw new ResponseError("Token inválido", 401, "UNAUTHORIZED");
  }

  return dataUser;
}

/**
 * Genera un refresh token opaco (string aleatorio).
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("base64url");
}

/**
 * Hashea un refresh token para guardarlo en la BD.
 *
 * @param token - Refresh token (el que ve el cliente).
 * @returns Hash SHA256 en hex (64 chars).
 */
export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Calcula la fecha de expiración de un refresh token.
 */
export function getRefreshTokenExpiresAt(now = new Date()): Date {
  const ms = env.REFRESH_TOKEN_EXPIRES_IN * 24 * 60 * 60 * 1000;
  return new Date(now.getTime() + ms);
}
