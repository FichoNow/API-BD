import { RowDataPacket } from "mysql2/promise";
import { pool } from "../pool.js";

interface CountRow extends RowDataPacket {
  count: number;
}

interface PunctualityRow extends RowDataPacket {
  total: number;
  on_time: number;
}

interface UserCountRow extends RowDataPacket {
  total: number;
  active: number;
}

interface RangeStatsRow extends RowDataPacket {
  day_label: string; // Puede ser el nombre del día o la fecha
  regular_minutes: number;
  overtime_minutes: number;
}

interface EmployeeRankRow extends RowDataPacket {
  id: number;
  name: string;
  regular_minutes: number;
  overtime_minutes: number;
  total_minutes: number;
  on_time_count: number;
  total_count: number;
}

export async function getRangeStats(
  departmentId: number,
  start: string,
  end: string,
  groupBy: 'weekday' | 'date',
  userId?: number,
): Promise<RangeStatsRow[]> {
  const userClause = userId ? "AND u.id = ?" : "";
  const params: unknown[] = [departmentId, start, end];
  if (userId) params.push(userId);

  const groupSql = groupBy === 'weekday' ? 'WEEKDAY(f.clock_in)' : 'DATE(f.clock_in)';

  const [rows] = await pool.query<RangeStatsRow[]>(
    `SELECT
       ${groupSql} AS day_label,
       SUM(LEAST(540, TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out))) AS regular_minutes,
       SUM(GREATEST(0, TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out) - 540)) AS overtime_minutes
     FROM fichajes f
     JOIN users u ON f.user_id = u.id
     WHERE u.department_id = ?
       AND f.clock_in >= ?
       AND f.clock_in < ?
       AND f.clock_out IS NOT NULL
       ${userClause}
     GROUP BY ${groupSql}
     ORDER BY day_label`,
    params,
  );
  return rows;
}

export async function getEmployeeRanking(
  departmentId: number,
  start: string,
  end: string,
): Promise<EmployeeRankRow[]> {
  const [rows] = await pool.query<EmployeeRankRow[]>(
    `SELECT
       u.id,
       u.name,
       SUM(LEAST(540, TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out))) AS regular_minutes,
       SUM(GREATEST(0, TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out) - 540)) AS overtime_minutes,
       SUM(TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out)) AS total_minutes,
       COUNT(f.id) AS total_count,
       SUM(CASE
         WHEN (HOUR(f.clock_in) * 60 + MINUTE(f.clock_in))
              <= (HOUR(dp.start_time) * 60 + MINUTE(dp.start_time) + 15)
         THEN 1 ELSE 0
       END) AS on_time_count
     FROM users u
     LEFT JOIN fichajes f ON f.user_id = u.id AND f.clock_in >= ? AND f.clock_in < ? AND f.clock_out IS NOT NULL
     LEFT JOIN asignaciones_usuario au
       ON au.user_id = u.id
       AND DATE(f.clock_in) BETWEEN au.start_date AND COALESCE(au.end_date, '9999-12-31')
     LEFT JOIN asignaciones_grupo ag
       ON ag.group_id = u.group_id
       AND DATE(f.clock_in) BETWEEN ag.start_date AND COALESCE(ag.end_date, '9999-12-31')
       AND au.user_id IS NULL
     LEFT JOIN dias_plantilla dp
       ON dp.template_id = COALESCE(au.template_id, ag.template_id)
       AND dp.weekday = WEEKDAY(f.clock_in) + 1
       AND dp.is_working_day = TRUE
     WHERE u.department_id = ?
     GROUP BY u.id, u.name
     ORDER BY total_minutes DESC`,
    [start, end, departmentId],
  );
  return rows;
}

export async function getActiveAbsencesCount(
  departmentId: number,
  today: string,
  userId?: number,
): Promise<number> {
  const userClause = userId ? "AND lr.user_id = ?" : "";
  const params: unknown[] = [departmentId, today, today];
  if (userId) params.push(userId);

  const [rows] = await pool.query<CountRow[]>(
    `SELECT COUNT(*) AS count
     FROM leave_requests lr
     JOIN users u ON lr.user_id = u.id
     JOIN leave_request_statuses lrs ON lr.status_id = lrs.id
     WHERE u.department_id = ?
       AND lrs.code = 'APPROVED'
       AND lr.start_date <= ?
       AND lr.end_date >= ?
       ${userClause}`,
    params,
  );
  return rows[0]?.count ?? 0;
}

export async function getPendingRequestsCount(
  departmentId: number,
  userId?: number,
): Promise<number> {
  const userClause = userId ? "AND lr.user_id = ?" : "";
  const params: unknown[] = [departmentId];
  if (userId) params.push(userId);

  const [rows] = await pool.query<CountRow[]>(
    `SELECT COUNT(*) AS count
     FROM leave_requests lr
     JOIN users u ON lr.user_id = u.id
     JOIN leave_request_statuses lrs ON lr.status_id = lrs.id
     WHERE u.department_id = ?
       AND lrs.code = 'PENDING'
       ${userClause}`,
    params,
  );
  return rows[0]?.count ?? 0;
}

export async function getPunctualityRate(
  departmentId: number,
  start: string,
  end: string,
  userId?: number,
): Promise<number> {
  const userClause = userId ? "AND u.id = ?" : "";
  const params: unknown[] = [departmentId, start, end];
  if (userId) params.push(userId);

  const [rows] = await pool.query<PunctualityRow[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE
         WHEN (HOUR(f.clock_in) * 60 + MINUTE(f.clock_in))
              <= (HOUR(dp.start_time) * 60 + MINUTE(dp.start_time) + 15)
         THEN 1 ELSE 0
       END) AS on_time
     FROM fichajes f
     JOIN users u ON f.user_id = u.id
     LEFT JOIN asignaciones_usuario au
       ON au.user_id = u.id
       AND DATE(f.clock_in) BETWEEN au.start_date AND COALESCE(au.end_date, '9999-12-31')
     LEFT JOIN asignaciones_grupo ag
       ON ag.group_id = u.group_id
       AND DATE(f.clock_in) BETWEEN ag.start_date AND COALESCE(ag.end_date, '9999-12-31')
       AND au.user_id IS NULL
     JOIN dias_plantilla dp
       ON dp.template_id = COALESCE(au.template_id, ag.template_id)
       AND dp.weekday = WEEKDAY(f.clock_in) + 1
       AND dp.is_working_day = TRUE
     WHERE u.department_id = ?
       AND f.clock_in >= ?
       AND f.clock_in < ?
       AND f.clock_out IS NOT NULL
       ${userClause}`,
    params,
  );

  const { total, on_time } = rows[0] ?? { total: 0, on_time: 0 };
  if (!total) return 100;
  return Math.round((on_time / total) * 100);
}

export async function getUserCounts(
  departmentId: number,
): Promise<{ total: number; active: number }> {
  const [rows] = await pool.query<UserCountRow[]>(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) AS active
     FROM users
     WHERE department_id = ?`,
    [departmentId],
  );
  return {
    total: rows[0]?.total ?? 0,
    active: rows[0]?.active ?? 0,
  };
}

export async function getHourlyDistribution(
  departmentId: number,
  start: string,
  end: string
): Promise<{ hour: number; count: number }[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT HOUR(clock_in) as hour, COUNT(*) as count
     FROM fichajes
     WHERE user_id IN (SELECT id FROM users WHERE department_id = ?)
     AND clock_in >= ? AND clock_in < ?
     GROUP BY hour
     ORDER BY hour ASC`,
    [departmentId, start, end]
  );
  return rows.map(r => ({ hour: Number(r.hour), count: Number(r.count) }));
}

export async function getAbsencesBreakdown(
  departmentId: number,
  start: string,
  end: string
): Promise<{ reason: string; count: number }[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.name as reason, COUNT(*) as count
     FROM leave_requests lr
     JOIN leave_request_types t ON lr.type_id = t.id
     JOIN leave_request_statuses s ON lr.status_id = s.id
     WHERE lr.user_id IN (SELECT id FROM users WHERE department_id = ?)
     AND s.code = 'APPROVED'
     AND (
       (lr.start_date BETWEEN ? AND ?) OR 
       (lr.end_date BETWEEN ? AND ?) OR
       (lr.start_date <= ? AND lr.end_date >= ?)
     )
     GROUP BY t.name`,
    [departmentId, start, end, start, end, start, end]
  );
  return rows.map(r => ({ reason: String(r.reason), count: Number(r.count) }));
}

