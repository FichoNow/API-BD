export interface CalendarDay {
  date: string;
  isWorkingDay: boolean;
  planned: {
    startTime: string;
    endTime: string;
    breakMinutes: number;
    plannedMinutes: number;
  } | null;
  statusType: string; // "WORKED" | "ABSENT" | "PLANNED" | "DAY_OFF" | code de tipos_excepcion
}

export interface GetCalendarMonthResponse {
  userId: number;
  year: number;
  month: number;
  days: CalendarDay[];
}
