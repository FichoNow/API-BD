/* Definimos la forma con que llegará el body al ednpoint 
*/
import { z } from "zod";


export interface PostLeaveRequestBody {
  type: 'VACATION' | 'PERMISSION' | 'SICK_LEAVE' | 'MEDICAL_APPOINTMENT' | 'DAY_OFF';
  start_date: string;
  end_date: string;
  start_time?: string | null;
  end_time?: string | null;
  comment?: string;
}



export const PostLeaveRequestBodySchema = z
    .object({
        type: z.enum([
            "VACATION",
            "PERMISSION",
            "SICK_LEAVE",
            "MEDICAL_APPOINTMENT",
            "DAY_OFF",
        ]),
        start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        start_time: z.union([
            z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
            z.null(),
        ]).optional(),
        end_time: z.union([
            z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
            z.null(),
        ]).optional(),
        comment: z.string().max(255).optional(),
    })
    .refine(
        (data) => {
            const hasStartTime = data.start_time !== undefined && data.start_time !== null;
            const hasEndTime = data.end_time !== undefined && data.end_time !== null;
            const bothEmpty =
                (data.start_time === undefined || data.start_time === null) &&
                (data.end_time === undefined || data.end_time === null);

            return (hasStartTime && hasEndTime) || bothEmpty;
        },
        {
            message: "start_time y end_time deben venir ambos informados o ambos vacíos/null",
            path: ["start_time"],
        },
    );