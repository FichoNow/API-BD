import { deleteRefreshTokenByUserId } from "../../../database/repositories/refresh-token-repository.js";

export async function logoutUser(userId: number): Promise<void> {
  await deleteRefreshTokenByUserId(userId);
}
