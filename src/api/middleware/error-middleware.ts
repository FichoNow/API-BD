import { Request, Response, NextFunction } from "express";
import { ResponseError } from "../../types/express/responseType/response-error-type.js";
import { BodyResponse } from "../../types/express/responseType/response-type.js";
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
  console.error(err);

  if (err instanceof ResponseError) {
    return res.status(err.statusCode).json({
      success: false,
      data: null,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    success: false,
    data: null,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Ha ocurrido un error inesperado",
    },
  });
}
