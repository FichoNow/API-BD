import { PostRefreshResponse } from "../../types/dto/auth/post-refresh-response.js";
import { issueJwt } from "./access-token-service.js";
import { validateRefreshToken } from "./refresh-token-service.js";

export async function refreshUser(
  refreshToken: string,
): Promise<PostRefreshResponse> {
  const userData = await validateRefreshToken(refreshToken);

  const accessToken = issueJwt({
    id: userData.id,
    company_id: userData.company_id,
    group_id: userData.group_id,
    role: userData.role,
  });

  console.log(`[REFRESH] Nuevo access token generado para userId=${userData.id} (${userData.email})`);

  return { accessToken };
}
