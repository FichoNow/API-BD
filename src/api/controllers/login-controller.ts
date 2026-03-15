import { Request, Response } from "express";
import { loginUser } from "../../services/login-service.js";
import { LoginBody } from "../../types/auth/login-body.js";

/**
 * Controller del endpoint de login.
 *
 * Su responsabilidad es:
 * 1. Recibir la petición HTTP.
 * 2. Extraer y validar los datos básicos del body (email y password).
 * 3. Delegar la lógica de autenticación al service `loginUser`.
 * 4. Devolver la respuesta HTTP correspondiente según el resultado.
 */
export async function loginController(req: Request, res: Response) {
  try {
    // Logs de depuración para comprobar que la petición llega bien.
    console.log("DEBUG: loginController ejecutado");
    console.log("DEBUG: body recibido =", req.body);

    const { email, password } = req.body as LoginBody;

    // Verificamos que email y password sea un string
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanPassword = typeof password === "string" ? password.trim() : "";

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({
        message: "Faltan datos: email y password son obligatorios",
      });
    }

    const result = await loginUser(cleanEmail, cleanPassword);

    if (!result) {
      console.error("Credenciales incorrectas devuelto");
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error en loginController:", error);

    res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}
