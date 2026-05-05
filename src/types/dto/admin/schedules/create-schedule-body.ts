import { z } from "zod";

/**
 * Día de una plantilla de horario recibido desde el panel admin.
 *
 * weekday:
 * 1 = Lunes
 * 2 = Martes
 * ...
 * 7 = Domingo
 */
export interface CreateScheduleDayBody {
  weekday: number;
  is_working_day: boolean;
  start_time: string | null;
  end_time: string | null;
  break_minutes: number;
}

/**
 * Body del endpoint POST /admin/schedule.
 *
 * Crea una plantilla de horario completa con sus días.
 */
export interface CreateScheduleBody {
  department_id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  days: CreateScheduleDayBody[];
}

const TimeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}:\d{2}$/)
  .nullable();

export const CreateScheduleBodySchema = z
  .object({
    department_id: z.number().int().positive(),
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(255).nullable().optional(),
    is_active: z.boolean(),
    days: z
      .array(
        z.object({
          weekday: z.number().int().min(1).max(7),
          is_working_day: z.boolean(),
          start_time: TimeSchema,
          end_time: TimeSchema,
          break_minutes: z.number().int().min(0),
        }),
      )
      .length(7),
  })
  .refine(
    (data) => {
      const weekdays = data.days.map((day) => day.weekday);
      return new Set(weekdays).size === 7;
    },
    {
      message: "Debe existir exactamente un día por cada weekday del 1 al 7",
      path: ["days"],
    },
  )
  .refine(
    (data) =>
      data.days.every((day) => {
        if (!day.is_working_day) {
          return day.start_time === null && day.end_time === null;
        }

        return day.start_time !== null && day.end_time !== null;
      }),
    {
      message:
        "Los días laborables deben tener start_time y end_time; los no laborables deben tenerlos a null",
      path: ["days"],
    },
  );