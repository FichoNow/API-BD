import { deleteRefreshTokenByHash } from "../../database/repositories/refresh-token-repository.js";
import { hashRefreshToken } from "./refresh-token-service.js";

export async function logoutUser(refreshToken: string): Promise<void> {
  const tokenHash = hashRefreshToken(refreshToken);
  await deleteRefreshTokenByHash(tokenHash);
}
