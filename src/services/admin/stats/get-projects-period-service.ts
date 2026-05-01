import { getProjectHours } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ProjectsPeriodResponse } from "../../../types/dto/admin/stats/get-stats-response.js";
import { assertDepartmentAccess, parsePeriod } from "./stats-helpers.js";

export async function getProjectsPeriodService(
  departmentId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
  groupId?: number,
  userId?: number,
): Promise<ProjectsPeriodResponse> {
  await assertDepartmentAccess(departmentId, claims)
  const { range } = parsePeriod(month, year)
  const projects = await getProjectHours(departmentId, range.start, range.end, userId, groupId)
  return { projects }
}
