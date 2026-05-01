import { getAbsencesBreakdown } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { AbsencesResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { assertDepartmentAccess, parsePeriod } from "./stats-helpers.js";

export async function getAbsencesService(
  departmentId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
  groupId?: number,
): Promise<AbsencesResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const { range } = parsePeriod(month, year)
  const reasons = await getAbsencesBreakdown(departmentId, range.start, range.end, groupId)
  return { reasons }
}
