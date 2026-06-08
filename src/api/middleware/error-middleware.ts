import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../../types/express/response-type.js";
import { BodyResponse } from "../../types/express/response-type.js";
/**
 * Middleware global de manejo de errores.
 *
 * Captura cualquier error lanzado en la app. Si es un AppError devuelve su código y mensaje,
 * si es cualquier otra cosa devuelve un 500 genérico.
 *
 * @param err - El error capturado.
 * @param req - Petición HTTP.
 * @param res - Respuesta HTTP donde se manda el JSON de error.
 * @param next - Función next (requerida por Express para reconocerlo como error middleware).
 */
export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response<BodyResponse>,
  next: NextFunction,
) {
  if (err instanceof ResponseError) {
    // Error operacional esperado (4xx): es una respuesta controlada (validación,
    // credenciales, conflicto...), no un fallo del servidor. No se vuelca al log
    // de errores para no ensuciarlo con cosas que no son bugs.
    return res.status(err.statusCode).json({
      data: null,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Error inesperado (bug real / 5xx): esto sí se registra para poder diagnosticarlo.
  console.error(err);

  return res.status(500).json({
    data: null,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Ha ocurrido un error inesperado",
    },
  });
}
