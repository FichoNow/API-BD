import { z } from "zod";

/**
 * Body del endpoint POST /admin/schedule/user-assignment.
 * 
 * Asigna una plantilla de horario concreto durante un rango de fechas.
 * 
 * end_date puede ser null si la asignación no tiene fecha de fin.
 */
export interface CreateUserScheduleAssignmentBody {
    user_id: number;
    template_id: number;
    start_date: string;
    end_date?: string | null;
}

const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const CreateUserScheduleAssignmentBodySchema = z.object({
    user_id: z.number().int().positive(),
    template_id: z.number().int().positive(),
    start_date: DateSchema,
    end_date: DateSchema.nullable().optional(),
}).refine(
    (data) => {
        if(!data.end_date) return true;
        return data.end_date >= data.start_date;
    },
    {
        message: "end_date no puede ser anterior a start_date",
        path: ["end_date"],
    },
);