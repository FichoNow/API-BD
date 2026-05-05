/**
 * Devuelve el día anterior a una fecha YYYY-MM-DD, también en formato YYYY-MM-DD.
 *
 * Se usa al cerrar asignaciones de horario abiertas: si una asignación nueva
 * empieza el 2026-05-10, la previa abierta se cierra el 2026-05-09.
 */
export function previousDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Normaliza un valor que mysql2 devuelve para una columna DATE a YYYY-MM-DD.
 *
 * Sin la opción `dateStrings: true` en el pool, mysql2 devuelve un `Date` para
 * las columnas DATE. Cuando se serializa en JSON aparecería como ISO completo
 * con zona horaria, lo que rompe las comparaciones lexicográficas en el cliente.
 * Esta función fuerza siempre el formato YYYY-MM-DD.
 */
export function toDateString(value: Date | string | null): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    // Puede venir como "YYYY-MM-DD" o como ISO completo.
    return value.length >= 10 ? value.slice(0, 10) : value;
  }
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
