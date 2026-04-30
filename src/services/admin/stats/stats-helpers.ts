import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { ResponseError } from "../../../types/express/response-type.js";

export const MONTH_LABELS = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
export const DAY_SHORT = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

export const LEGAL_OVERTIME_LIMIT_MINUTES = 80 * 60;

export function localDate(d: Date) {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${dd}`
}

export function getWeekBounds(date: Date): { start: string; end: string } {
  const day  = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const mon  = new Date(date); mon.setDate(date.getDate() + diff); mon.setHours(0,0,0,0)
  const next = new Date(mon);  next.setDate(mon.getDate() + 7)
  return { start: localDate(mon), end: localDate(next) }
}

export function getMonthBounds(month: number, year: number): { start: string; end: string } {
  const pad = (n: number) => String(n).padStart(2, "0")
  const nm  = month === 12 ? 1 : month + 1
  const ny  = month === 12 ? year + 1 : year
  return { start: `${year}-${pad(month)}-01`, end: `${ny}-${pad(nm)}-01` }
}

export function getPrevBounds(range: { start: string; end: string }): { start: string; end: string } {
  const s  = new Date(range.start + "T00:00:00")
  const e  = new Date(range.end   + "T00:00:00")
  const ms = e.getTime() - s.getTime()
  const ps = new Date(s.getTime() - ms)
  return { start: localDate(ps), end: localDate(s) }
}

export function fmtDayLabel(dateStr: string): string {
  const d   = new Date(dateStr + "T00:00:00")
  const dow = DAY_SHORT[d.getDay()]
  return `${dow} ${d.getDate()} ${MONTH_LABELS[d.getMonth()].substring(0, 3)}`
}

export interface PeriodParsed {
  range: { start: string; end: string }
  prev:  { start: string; end: string }
  periodLabel: string
  groupBy: "weekday" | "date"
}

export function parsePeriod(month?: number, year?: number): PeriodParsed {
  if (month && year) {
    const range = getMonthBounds(month, year)
    return { range, prev: getPrevBounds(range), periodLabel: `${MONTH_LABELS[month - 1]} ${year}`, groupBy: "date" }
  }
  const range = getWeekBounds(new Date())
  return { range, prev: getPrevBounds(range), periodLabel: "Esta Semana", groupBy: "weekday" }
}

export async function assertDepartmentAccess(departmentId: number, claims: JwtClaims): Promise<void> {
  const department = await findDepartmentById(departmentId)
  if (!department || department.company_id !== claims.company_id)
    throw new ResponseError("Departamento no encontrado", 404, "DEPARTMENT_NOT_FOUND")
  if (claims.role === "ADMINISTRATOR" && claims.department_id !== departmentId)
    throw new ResponseError("No autorizado", 403, "FORBIDDEN")
}
