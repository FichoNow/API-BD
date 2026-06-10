import { RowDataPacket } from "mysql2/promise";
import { pool } from "../pool.js";

interface CountRow extends RowDataPacket { count: number }
interface PunctualityRow extends RowDataPacket { total: number; on_time: number }
interface UserCountRow extends RowDataPacket { total: number; active: number }

interface RangeStatsRow extends RowDataPacket {
  day_label: string | Date
  regular_minutes: number
  overtime_minutes: number
  edited_count: number
  outside_schedule_count: number
}

interface EmployeeRankRow extends RowDataPacket {
  id: number; name: string
  regular_minutes: number; overtime_minutes: number; total_minutes: number
  on_time_count: number; total_count: number
}

interface ActiveNowRow extends RowDataPacket {
  id: number; name: string; clock_in: Date
}

interface ProjectHoursRow extends RowDataPacket {
  project_name: string; minutes: number
}

interface TopDayRow extends RowDataPacket {
  day: Date | string; total_minutes: number
}

// ── Queries existentes ─────────────────────────────────────

export async function getRangeStats(
  departmentId: number, start: string, end: string,
  groupBy: "weekday" | "date", userId?: number, groupId?: number,
): Promise<RangeStatsRow[]> {
  const userClause  = userId  ? "AND u.id = ?"       : ""
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId, start, end]
  if (userId)  params.push(userId)
  if (groupId) params.push(groupId)
  const groupSql = groupBy === "weekday" ? "WEEKDAY(f.clock_in)" : "DATE(f.clock_in)"
  const [rows] = await pool.query<RangeStatsRow[]>(
    `SELECT ${groupSql} AS day_label,
       SUM(LEAST(540, TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out))) AS regular_minutes,
       SUM(GREATEST(0, TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out) - 540)) AS overtime_minutes,
       SUM(CASE WHEN f.clock_in_modified OR f.clock_out_modified THEN 1 ELSE 0 END) AS edited_count,
       SUM(CASE WHEN dp.template_id IS NULL THEN 1 ELSE 0 END) AS outside_schedule_count
     FROM fichajes f JOIN users u ON f.user_id = u.id
     LEFT JOIN asignaciones_usuario au ON au.user_id = u.id
       AND DATE(f.clock_in) BETWEEN au.start_date AND COALESCE(au.end_date,'9999-12-31')
     LEFT JOIN asignaciones_grupo ag ON ag.group_id = u.group_id
       AND DATE(f.clock_in) BETWEEN ag.start_date AND COALESCE(ag.end_date,'9999-12-31')
       AND au.user_id IS NULL
     LEFT JOIN dias_plantilla dp ON dp.template_id = COALESCE(au.template_id, ag.template_id)
       AND dp.weekday = WEEKDAY(f.clock_in)+1 AND dp.is_working_day = TRUE
     WHERE u.department_id = ? AND f.clock_in >= ? AND f.clock_in < ?
       AND f.clock_out IS NOT NULL ${userClause} ${groupClause}
     GROUP BY ${groupSql} ORDER BY day_label`,
    params,
  )
  return rows
}

export async function getActiveAbsencesCount(
  departmentId: number, today: string, userId?: number, groupId?: number,
): Promise<number> {
  const userClause  = userId  ? "AND lr.user_id = ?"  : ""
  const groupClause = groupId ? "AND u.group_id = ?"  : ""
  const params: unknown[] = [departmentId, today, today]
  if (userId)  params.push(userId)
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<CountRow[]>(
    `SELECT COUNT(*) AS count FROM leave_requests lr
     JOIN users u ON lr.user_id = u.id
     JOIN leave_request_statuses lrs ON lr.status_id = lrs.id
     WHERE u.department_id = ? AND lrs.code = 'APPROVED'
       AND lr.start_date <= ? AND lr.end_date >= ? ${userClause} ${groupClause}`,
    params,
  )
  return rows[0]?.count ?? 0
}

export async function getPendingRequestsCount(
  departmentId: number, userId?: number, groupId?: number,
): Promise<number> {
  const userClause  = userId  ? "AND lr.user_id = ?" : ""
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId]
  if (userId)  params.push(userId)
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<CountRow[]>(
    `SELECT COUNT(*) AS count FROM leave_requests lr
     JOIN users u ON lr.user_id = u.id
     JOIN leave_request_statuses lrs ON lr.status_id = lrs.id
     WHERE u.department_id = ? AND lrs.code = 'PENDING' ${userClause} ${groupClause}`,
    params,
  )
  return rows[0]?.count ?? 0
}

export async function getPunctualityRate(
  departmentId: number, start: string, end: string, userId?: number, groupId?: number,
): Promise<number> {
  const userClause  = userId  ? "AND u.id = ?"       : ""
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId, start, end]
  if (userId)  params.push(userId)
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<PunctualityRow[]>(
    `SELECT COUNT(*) AS total,
       SUM(CASE WHEN (HOUR(f.clock_in)*60+MINUTE(f.clock_in))
                     <= (HOUR(dp.start_time)*60+MINUTE(dp.start_time)+15) THEN 1 ELSE 0 END) AS on_time
     FROM fichajes f JOIN users u ON f.user_id = u.id
     LEFT JOIN asignaciones_usuario au ON au.user_id = u.id
       AND DATE(f.clock_in) BETWEEN au.start_date AND COALESCE(au.end_date,'9999-12-31')
     LEFT JOIN asignaciones_grupo ag ON ag.group_id = u.group_id
       AND DATE(f.clock_in) BETWEEN ag.start_date AND COALESCE(ag.end_date,'9999-12-31')
       AND au.user_id IS NULL
     JOIN dias_plantilla dp ON dp.template_id = COALESCE(au.template_id,ag.template_id)
       AND dp.weekday = WEEKDAY(f.clock_in)+1 AND dp.is_working_day = TRUE
     WHERE u.department_id = ? AND f.clock_in >= ? AND f.clock_in < ?
       AND f.clock_out IS NOT NULL ${userClause} ${groupClause}`,
    params,
  )
  const { total, on_time } = rows[0] ?? { total: 0, on_time: 0 }
  if (!total) return 100
  return Math.round((on_time / total) * 100)
}

export async function getUserCounts(
  departmentId: number, groupId?: number,
): Promise<{ total: number; active: number }> {
  const groupClause = groupId ? "AND group_id = ?" : ""
  const params: unknown[] = [departmentId]
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<UserCountRow[]>(
    `SELECT COUNT(*) AS total, SUM(CASE WHEN is_active=TRUE THEN 1 ELSE 0 END) AS active
     FROM users WHERE department_id = ? ${groupClause}`,
    params,
  )
  return { total: rows[0]?.total ?? 0, active: rows[0]?.active ?? 0 }
}

export async function getEmployeeRanking(
  departmentId: number, start: string, end: string, groupId?: number,
): Promise<EmployeeRankRow[]> {
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [start, end, departmentId]
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<EmployeeRankRow[]>(
    `SELECT u.id, u.name,
       SUM(LEAST(540,TIMESTAMPDIFF(MINUTE,f.clock_in,f.clock_out))) AS regular_minutes,
       SUM(GREATEST(0,TIMESTAMPDIFF(MINUTE,f.clock_in,f.clock_out)-540)) AS overtime_minutes,
       SUM(TIMESTAMPDIFF(MINUTE,f.clock_in,f.clock_out)) AS total_minutes,
       COUNT(f.id) AS total_count,
       SUM(CASE WHEN (HOUR(f.clock_in)*60+MINUTE(f.clock_in))
                     <=(HOUR(dp.start_time)*60+MINUTE(dp.start_time)+15) THEN 1 ELSE 0 END) AS on_time_count
     FROM users u
     LEFT JOIN fichajes f ON f.user_id=u.id AND f.clock_in>=? AND f.clock_in<? AND f.clock_out IS NOT NULL
     LEFT JOIN asignaciones_usuario au ON au.user_id=u.id
       AND DATE(f.clock_in) BETWEEN au.start_date AND COALESCE(au.end_date,'9999-12-31')
     LEFT JOIN asignaciones_grupo ag ON ag.group_id=u.group_id
       AND DATE(f.clock_in) BETWEEN ag.start_date AND COALESCE(ag.end_date,'9999-12-31')
       AND au.user_id IS NULL
     LEFT JOIN dias_plantilla dp ON dp.template_id=COALESCE(au.template_id,ag.template_id)
       AND dp.weekday=WEEKDAY(f.clock_in)+1 AND dp.is_working_day=TRUE
     WHERE u.department_id=? ${groupClause}
     GROUP BY u.id, u.name ORDER BY total_minutes DESC`,
    params,
  )
  return rows
}

export async function getHourlyDistribution(
  departmentId: number, start: string, end: string, groupId?: number,
): Promise<{ hour: number; count: number }[]> {
  const groupClause = groupId ? "AND group_id = ?" : ""
  const params: unknown[] = [departmentId]
  if (groupId) params.push(groupId)
  params.push(start, end)
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT HOUR(clock_in) as hour, COUNT(*) as count FROM fichajes
     WHERE user_id IN (SELECT id FROM users WHERE department_id=? ${groupClause})
       AND clock_in>=? AND clock_in<? GROUP BY hour ORDER BY hour ASC`,
    params,
  )
  return rows.map((r) => ({ hour: Number(r.hour), count: Number(r.count) }))
}

export async function getAbsencesBreakdown(
  departmentId: number, start: string, end: string, groupId?: number,
): Promise<{ reason: string; count: number }[]> {
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId, start, end]
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.name as reason, COUNT(*) as count
     FROM leave_requests lr
     JOIN leave_request_types t ON lr.type_id=t.id
     JOIN leave_request_statuses s ON lr.status_id=s.id
     JOIN users u ON lr.user_id=u.id
     WHERE u.department_id=? AND s.code IN ('APPROVED','PENDING')
       AND lr.start_date>=? AND lr.start_date<? ${groupClause}
     GROUP BY t.name ORDER BY count DESC`,
    params,
  )
  return rows.map((r) => ({ reason: String(r.reason), count: Number(r.count) }))
}

// ── Nuevas queries ─────────────────────────────────────────

export async function getActiveNow(
  departmentId: number, groupId?: number,
): Promise<{ id: number; name: string; clock_in: string }[]> {
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId]
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<ActiveNowRow[]>(
    `SELECT u.id, u.name, f.clock_in FROM fichajes f
     JOIN users u ON f.user_id=u.id
     WHERE u.department_id=? AND f.clock_out IS NULL ${groupClause}
     ORDER BY f.clock_in ASC`,
    params,
  )
  return rows.map((r) => ({
    id: r.id, name: r.name,
    clock_in: r.clock_in instanceof Date ? r.clock_in.toISOString() : String(r.clock_in),
  }))
}

export async function getProjectHours(
  departmentId: number, start: string, end: string, userId?: number, groupId?: number,
): Promise<{ project_name: string; minutes: number }[]> {
  const userClause  = userId  ? "AND u.id = ?"       : ""
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId, start, end]
  if (userId)  params.push(userId)
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<ProjectHoursRow[]>(
    `SELECT p.name AS project_name,
       SUM(TIMESTAMPDIFF(MINUTE, fe.started_at, fe.ended_at)) AS minutes
     FROM fichaje_entries fe
     JOIN fichajes f ON fe.fichaje_id=f.id
     JOIN users u ON f.user_id=u.id
     JOIN projects p ON fe.project_id=p.id
     WHERE u.department_id=? AND fe.started_at>=? AND fe.started_at<?
       AND fe.ended_at IS NOT NULL ${userClause} ${groupClause}
     GROUP BY p.id, p.name ORDER BY minutes DESC LIMIT 8`,
    params,
  )
  return rows.map((r) => ({ project_name: String(r.project_name), minutes: Number(r.minutes) }))
}

export async function getUserProjectMinutes(
  departmentId: number, start: string, end: string, groupId?: number,
): Promise<{ user_id: number; user_name: string; project_name: string; minutes: number }[]> {
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId, start, end]
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id AS user_id, u.name AS user_name,
       p.name AS project_name,
       SUM(TIMESTAMPDIFF(MINUTE, fe.started_at, fe.ended_at)) AS minutes
     FROM fichaje_entries fe
     JOIN fichajes f ON fe.fichaje_id = f.id
     JOIN users u    ON f.user_id = u.id
     JOIN projects p ON fe.project_id = p.id
     WHERE u.department_id = ? AND fe.started_at >= ? AND fe.started_at < ?
       AND fe.ended_at IS NOT NULL ${groupClause}
     GROUP BY u.id, u.name, p.id, p.name
     ORDER BY u.name ASC, minutes DESC`,
    params,
  )
  return rows.map((r) => ({
    user_id:      Number(r.user_id),
    user_name:    String(r.user_name),
    project_name: String(r.project_name),
    minutes:      Number(r.minutes),
  }))
}

export async function getProjectUserBreakdown(
  departmentId: number, projectName: string, start: string, end: string,
): Promise<{ user_id: number; user_name: string; minutes: number }[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id AS user_id, u.name AS user_name,
       SUM(TIMESTAMPDIFF(MINUTE, fe.started_at, fe.ended_at)) AS minutes
     FROM fichaje_entries fe
     JOIN fichajes f ON fe.fichaje_id = f.id
     JOIN users u ON f.user_id = u.id
     JOIN projects p ON fe.project_id = p.id
     WHERE u.department_id = ? AND p.name = ?
       AND fe.started_at >= ? AND fe.started_at < ?
       AND fe.ended_at IS NOT NULL
     GROUP BY u.id, u.name ORDER BY minutes DESC`,
    [departmentId, projectName, start, end],
  )
  return rows.map((r) => ({
    user_id:   Number(r.user_id),
    user_name: String(r.user_name),
    minutes:   Number(r.minutes),
  }))
}

export async function getBreaksStats(
  departmentId: number, start: string, end: string, userId?: number, groupId?: number,
): Promise<{ total_break_minutes: number; fichajes_with_break: number; total_fichajes: number; avg_break_minutes: number }> {
  const userClause  = userId  ? "AND u.id = ?"       : ""
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId, start, end]
  if (userId)  params.push(userId)
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
       COALESCE(SUM(TIMESTAMPDIFF(MINUTE, fb.started_at, fb.ended_at)), 0) AS total_break_minutes,
       COUNT(DISTINCT CASE WHEN fb.id IS NOT NULL THEN f.id END) AS fichajes_with_break,
       COUNT(DISTINCT f.id) AS total_fichajes
     FROM fichajes f
     JOIN users u ON f.user_id = u.id
     LEFT JOIN fichaje_breaks fb ON fb.fichaje_id = f.id AND fb.ended_at IS NOT NULL
     WHERE u.department_id = ? AND f.clock_in >= ? AND f.clock_in < ?
       AND f.clock_out IS NOT NULL ${userClause} ${groupClause}`,
    params,
  )
  const r = rows[0] ?? { total_break_minutes: 0, fichajes_with_break: 0, total_fichajes: 0 }
  const total = Number(r.total_break_minutes)
  const withBreak = Number(r.fichajes_with_break)
  return {
    total_break_minutes: total,
    fichajes_with_break: withBreak,
    total_fichajes:      Number(r.total_fichajes),
    avg_break_minutes:   withBreak > 0 ? Math.round(total / withBreak) : 0,
  }
}

export async function getOvertimeYearly(
  departmentId: number, year: number, userId?: number, groupId?: number,
): Promise<{ user_id: number; user_name: string; overtime_minutes: number }[]> {
  const userClause  = userId  ? "AND u.id = ?"       : ""
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [`${year}-01-01`, `${year + 1}-01-01`, departmentId]
  if (userId)  params.push(userId)
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id AS user_id, u.name AS user_name,
       COALESCE(SUM(GREATEST(0, TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out) - 540)), 0) AS overtime_minutes
     FROM users u
     LEFT JOIN fichajes f ON f.user_id = u.id AND f.clock_in >= ? AND f.clock_in < ? AND f.clock_out IS NOT NULL
     WHERE u.department_id = ? ${userClause} ${groupClause}
     GROUP BY u.id, u.name
     HAVING overtime_minutes > 0
     ORDER BY overtime_minutes DESC`,
    params,
  )
  return rows.map((r) => ({
    user_id:          Number(r.user_id),
    user_name:        String(r.user_name),
    overtime_minutes: Number(r.overtime_minutes),
  }))
}

export async function getDepartmentGroups(
  departmentId: number,
): Promise<{ id: number; name: string }[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id, name FROM work_groups WHERE department_id = ? ORDER BY name ASC`,
    [departmentId],
  )
  return rows.map((r) => ({ id: Number(r.id), name: String(r.name) }))
}

export async function getAllProjectsTotals(
  departmentId: number,
): Promise<{ project_name: string; minutes: number; user_count: number }[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.name AS project_name,
       COALESCE(stats.minutes, 0)    AS minutes,
       COALESCE(stats.user_count, 0) AS user_count
     FROM projects p
     LEFT JOIN (
       SELECT fe.project_id,
         SUM(TIMESTAMPDIFF(MINUTE, fe.started_at, fe.ended_at)) AS minutes,
         COUNT(DISTINCT f.user_id) AS user_count
       FROM fichaje_entries fe
       JOIN fichajes f ON fe.fichaje_id = f.id
       JOIN users u    ON f.user_id = u.id
       WHERE u.department_id = ? AND fe.ended_at IS NOT NULL
       GROUP BY fe.project_id
     ) stats ON stats.project_id = p.id
     WHERE p.department_id = ?
     ORDER BY minutes DESC`,
    [departmentId, departmentId],
  )
  return rows.map((r) => ({
    project_name: String(r.project_name),
    minutes:      Number(r.minutes),
    user_count:   Number(r.user_count),
  }))
}

export async function getAllTimeProjectUserBreakdown(
  departmentId: number,
  projectName: string,
): Promise<{ user_id: number; user_name: string; minutes: number }[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT u.id AS user_id, u.name AS user_name,
       SUM(TIMESTAMPDIFF(MINUTE, fe.started_at, fe.ended_at)) AS minutes
     FROM fichaje_entries fe
     JOIN fichajes f ON fe.fichaje_id = f.id
     JOIN users u    ON f.user_id = u.id
     JOIN projects p ON fe.project_id = p.id
     WHERE u.department_id = ? AND p.name = ? AND fe.ended_at IS NOT NULL
     GROUP BY u.id, u.name ORDER BY minutes DESC`,
    [departmentId, projectName],
  )
  return rows.map((r) => ({
    user_id:   Number(r.user_id),
    user_name: String(r.user_name),
    minutes:   Number(r.minutes),
  }))
}

export async function getTopDays(
  departmentId: number, start: string, end: string, userId?: number, groupId?: number,
): Promise<{ date: string; total_minutes: number }[]> {
  const userClause  = userId  ? "AND u.id = ?"       : ""
  const groupClause = groupId ? "AND u.group_id = ?" : ""
  const params: unknown[] = [departmentId, start, end]
  if (userId)  params.push(userId)
  if (groupId) params.push(groupId)
  const [rows] = await pool.query<TopDayRow[]>(
    `SELECT DATE(f.clock_in) AS day,
       SUM(TIMESTAMPDIFF(MINUTE,f.clock_in,f.clock_out)) AS total_minutes
     FROM fichajes f JOIN users u ON f.user_id=u.id
     WHERE u.department_id=? AND f.clock_in>=? AND f.clock_in<? AND f.clock_out IS NOT NULL
       ${userClause} ${groupClause}
     GROUP BY DATE(f.clock_in) ORDER BY total_minutes DESC LIMIT 3`,
    params,
  )
  const fmtDate = (v: Date | string) =>
    v instanceof Date
      ? `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,"0")}-${String(v.getDate()).padStart(2,"0")}`
      : String(v).split("T")[0]
  return rows.map((r) => ({ date: fmtDate(r.day), total_minutes: Number(r.total_minutes) }))
}
