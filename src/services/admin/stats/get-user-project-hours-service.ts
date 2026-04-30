import { getUserProjectMinutes } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { UserProjectHoursResponse } from "../../../types/dto/admin/get-stats-response.js";
import { assertDepartmentAccess, parsePeriod } from "./stats-helpers.js";

export async function getUserProjectHoursService(
  departmentId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
  groupId?: number,
): Promise<UserProjectHoursResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const { range } = parsePeriod(month, year)
  const rows = await getUserProjectMinutes(departmentId, range.start, range.end, groupId)
  return { rows }
}
