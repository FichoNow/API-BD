import { z } from "zod";

/**
 * Body común para aprobar o rechazar una solicitud desde el panel admin.
 *
 * El comentario de revisión es opcional, pero si viene informado
 * no puede superar los 255 caracteres.
 */
export interface ReviewRequestBody {
  review_comment?: string | null;
}

export const ReviewRequestBodySchema = z.object({
  review_comment: z
    .union([
      z.string().max(255),
      z.null(),
    ])
    .optional(),
});