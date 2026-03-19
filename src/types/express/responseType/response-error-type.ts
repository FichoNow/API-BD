/**
 * Error personalizado para lanzar errores controlados en la app.
 *
 * Extiende Error añadiendo un código HTTP y un código de error identificable.
 * Se usa en controllers, services y middlewares para devolver respuestas de error claras.
 */
export class ResponseError extends Error {
  public statusCode: number;
  public code: string;

  /**
   * @param message - Mensaje descriptivo del error.
   * @param statusCode - Código HTTP de la respuesta (por defecto 500).
   * @param code - Código identificador del error, ej: "UNAUTHORIZED" (por defecto "INTERNAL_ERROR").
   */
  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
