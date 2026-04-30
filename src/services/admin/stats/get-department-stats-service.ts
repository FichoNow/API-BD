import { findDepartmentById } from "../../../database/repositories/department-repository.js";
import {
  getRangeStats,
  getActiveAbsencesCount,
  getPendingRequestsCount,
  getPunctualityRate,
  getUserCounts,
  getEmployeeRanking,
  getHourlyDistribution,
  getAbsencesBreakdown,
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

export async function getDepartmentStatsService(
  departmentId: number,
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

  const [daily, activeAbsences, pendingRequests, punctuality, userCounts, ranking, hourlyDist, absencesBreakdown] =
    await Promise.all([
      getRangeStats(departmentId, range.start, range.end, groupBy),
      getActiveAbsencesCount(departmentId, today),
      getPendingRequestsCount(departmentId),
      getPunctualityRate(departmentId, range.start, range.end),
      getUserCounts(departmentId),
      getEmployeeRanking(departmentId, range.start, range.end),
      getHourlyDistribution(departmentId, range.start, range.end),
      getAbsencesBreakdown(departmentId, range.start, range.end),
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
  if (punctualityRate < 85) insights.push(`Puntualidad media (${punctualityRate}%) por debajo del objetivo. Revisar horarios de entrada.`);
  if (overtimeMinutes > totalMinutes * 0.1) insights.push("Volumen de horas extras elevado (>10%). Evaluar distribución de tareas.");
  if (ranking.length > 0) insights.push(`Rendimiento destacado: ${ranking[0].name} lidera las horas totales.`);
  if (hourlyDist.length > 0) {
    const peak = [...hourlyDist].sort((a, b) => b.count - a.count)[0];
    insights.push(`Pico de actividad: mayoría de entradas a las ${peak.hour}:00h.`);
  }

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
    top_employees:       ranking.map((r) => ({
      id:               r.id,
      name:             r.name,
      regular_minutes:  Number(r.regular_minutes),
      overtime_minutes: Number(r.overtime_minutes),
      total_minutes:    Number(r.total_minutes),
      punctuality_rate: r.total_count ? Math.round((r.on_time_count / r.total_count) * 100) : 100,
    })),
    hourly_distribution: hourlyDist,
    absences_breakdown:  absencesBreakdown,
    insights,
  };
}
