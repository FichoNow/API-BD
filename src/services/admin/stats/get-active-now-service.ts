import { getActiveNow } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ActiveNowResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { assertDepartmentAccess } from "./stats-helpers.js";

export async function getActiveNowService(
  departmentId: number,
  claims: JwtClaims,
  groupId?: number,
): Promise<ActiveNowResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const active = await getActiveNow(departmentId, groupId)
  return { active }
}
