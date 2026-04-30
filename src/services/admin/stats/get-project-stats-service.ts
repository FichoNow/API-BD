import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { getProjectUserBreakdown, getAllTimeProjectUserBreakdown } from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { GetProjectStatsResponse } from "../../../types/dto/admin/get-stats-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

const MONTH_LABELS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function localDate(d: Date) {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

function getWeekBounds(date: Date): { start: string; end: string } {
  const day  = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon  = new Date(date); mon.setDate(date.getDate() + diff); mon.setHours(0,0,0,0)
  const next = new Date(mon);  next.setDate(mon.getDate() + 7)
  return { start: localDate(mon), end: localDate(next) }
}

function getMonthBounds(month: number, year: number): { start: string; end: string } {
  const pad = (n: number) => String(n).padStart(2, "0")
  const nm  = month === 12 ? 1 : month + 1
  const ny  = month === 12 ? year + 1 : year
  return { start: `${year}-${pad(month)}-01`, end: `${ny}-${pad(nm)}-01` }
}

export async function getProjectStatsService(
  departmentId: number,
  projectName: string,
  claims: JwtClaims,
  month?: number,
  year?: number,
  allTime?: boolean,
): Promise<GetProjectStatsResponse> {
  const department = await findDepartmentById(departmentId)
  if (!department || department.company_id !== claims.company_id)
    throw new ResponseError("Departamento no encontrado", 404, "DEPARTMENT_NOT_FOUND")
  if (claims.role === "ADMINISTRATOR" && claims.department_id !== departmentId)
    throw new ResponseError("No autorizado", 403, "FORBIDDEN")

  let users: { user_id: number; user_name: string; minutes: number }[]
  let periodLabel: string

  if (allTime) {
    users = await getAllTimeProjectUserBreakdown(departmentId, projectName)
    periodLabel = "Histórico Total"
  } else if (month && year) {
    const range = getMonthBounds(month, year)
    periodLabel = `${MONTH_LABELS[month - 1]} ${year}`
    users = await getProjectUserBreakdown(departmentId, projectName, range.start, range.end)
  } else {
    const range = getWeekBounds(new Date())
    periodLabel = "Esta Semana"
    users = await getProjectUserBreakdown(departmentId, projectName, range.start, range.end)
  }

  const total_minutes = users.reduce((s, u) => s + u.minutes, 0)
  return { project_name: projectName, total_minutes, period_label: periodLabel, users }
}
