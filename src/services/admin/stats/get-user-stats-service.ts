import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import { findUsersByDepartmentId } from "../../../database/repositories/user-repository.js";
import {
  getRangeStats,
  getActiveAbsencesCount,
  getPendingRequestsCount,
  getPunctualityRate,
  getUserCounts,
} from "../../../database/repositories/stats-repository.js";
import { JwtClaims } from "../../../types/dto/jwt/jwt-claims-dto.js";
import { GetStatsResponse } from "../../../types/dto/admin/get-stats-response.js";
import { ResponseError } from "../../../types/express/response-type.js";

function getWeekBounds(date: Date): { start: string; end: string } {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const nextMonday = new Date(monday);
  nextMonday.setDate(monday.getDate() + 7);
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  return { start: fmt(monday), end: fmt(nextMonday) };
}

function getMonthBounds(month: number, year: number): { start: string; end: string } {
  const pad = (n: number) => String(n).padStart(2, "0");
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear  = month === 12 ? year + 1 : year;
  return {
    start: `${year}-${pad(month)}-01`,
    end:   `${nextYear}-${pad(nextMonth)}-01`,
  };
}

const MONTH_LABELS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

export async function getUserStatsService(
  departmentId: number,
  userId: number,
  claims: JwtClaims,
  month?: number,
  year?: number,
): Promise<GetStatsResponse> {
  const department = await findDepartmentById(departmentId);

  if (!department || department.company_id !== claims.company_id) {
    throw new ResponseError("Departamento no encontrado", 404, "DEPARTMENT_NOT_FOUND");
  }

  if (claims.role === "ADMINISTRATOR" && claims.department_id !== departmentId) {
    throw new ResponseError("No autorizado", 403, "FORBIDDEN");
  }

  const users = await findUsersByDepartmentId(departmentId);
  if (!users.some((u) => u.id === userId)) {
    throw new ResponseError("El usuario no pertenece a este departamento", 404, "USER_NOT_FOUND");
  }

  const now   = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

  let range: { start: string; end: string };
  let periodLabel: string;
  let groupBy: "weekday" | "date";

  if (month && year) {
    range       = getMonthBounds(month, year);
    periodLabel = `${MONTH_LABELS[month - 1]} ${year}`;
    groupBy     = "date";
  } else {
    range       = getWeekBounds(now);
    periodLabel = "Esta Semana";
    groupBy     = "weekday";
  }

  const [daily, activeAbsences, pendingRequests, punctuality, userCounts] =
    await Promise.all([
      getRangeStats(departmentId, range.start, range.end, groupBy, userId),
      getActiveAbsencesCount(departmentId, today, userId),
      getPendingRequestsCount(departmentId, userId),
      getPunctualityRate(departmentId, range.start, range.end, userId),
      getUserCounts(departmentId),
    ]);

  const fmtDate = (label: unknown): string => {
    if (label instanceof Date) {
      const y = label.getFullYear();
      const m = String(label.getMonth() + 1).padStart(2, "0");
      const d = String(label.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    return String(label).split("T")[0];
  };

  const parsedDaily = daily.map((d) => ({
    weekday:          groupBy === "weekday" ? Number(d.day_label) : new Date(fmtDate(d.day_label) + "T00:00:00").getDay(),
    date:             groupBy === "date" ? fmtDate(d.day_label) : undefined,
    regular_minutes:  Number(d.regular_minutes),
    overtime_minutes: Number(d.overtime_minutes),
  }));

  const totalMinutes    = parsedDaily.reduce((s, d) => s + d.regular_minutes + d.overtime_minutes, 0);
  const overtimeMinutes = parsedDaily.reduce((s, d) => s + d.overtime_minutes, 0);
  const punctualityRate = Number(punctuality);

  const insights: string[] = [];
  if (punctualityRate < 85) insights.push(`Puntualidad del empleado (${punctualityRate}%) por debajo del objetivo.`);
  if (overtimeMinutes > 120) insights.push(`${Math.floor(overtimeMinutes / 60)}h de horas extra acumuladas este período.`);
  if (totalMinutes === 0) insights.push("Sin fichajes registrados en este período.");

  return {
    period_label:        periodLabel,
    total_minutes:       totalMinutes,
    overtime_minutes:    overtimeMinutes,
    punctuality_rate:    punctualityRate,
    active_absences:     Number(activeAbsences),
    pending_requests:    Number(pendingRequests),
    employees_active:    Number(userCounts.active),
    employees_total:     Number(userCounts.total),
    daily:               parsedDaily,
    top_employees:       [],
    hourly_distribution: [],
    absences_breakdown:  [],
    insights,
  };
}
