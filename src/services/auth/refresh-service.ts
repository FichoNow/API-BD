import { PostRefreshBody } from "../../types/dto/auth/post-refresh-body.js";
import { PostRefreshResponse } from "../../types/dto/auth/post-refresh-response.js";
import { issueJwt } from "./access-token-service.js";
import { rotateRefreshToken } from "./refresh-token-service.js";

export async function refreshUser(
  body: PostRefreshBody,
): Promise<PostRefreshResponse> {
  const { userData, newRefreshToken } = await rotateRefreshToken(body.refreshToken);

  const accessToken = issueJwt({
    id: userData.id,
    company_id: userData.company_id,
    group_id: userData.group_id,
    role: userData.role,
  });

  console.log(`[REFRESH] Token rotado para userId=${userData.id} (${userData.email})`);

  return { accessToken, refreshToken: newRefreshToken };
}
