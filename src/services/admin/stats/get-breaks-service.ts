import { getBreaksStats } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { BreaksResponse } from "../../../types/dto/admin/get-stats-response.js";
import { assertDepartmentAccess, parsePeriod } from "./stats-helpers.js";

export async function getBreaksService(
  departmentId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
  groupId?: number,
  userId?: number,
): Promise<BreaksResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const { range } = parsePeriod(month, year)
  return getBreaksStats(departmentId, range.start, range.end, userId, groupId)
}
