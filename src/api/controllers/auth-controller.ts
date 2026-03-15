// Importamos los tipos Request y Response de Express.
import { Request, Response } from "express";
// Importamos la lógica del login desde el service.
import { loginUser } from "../../services/auth-service.js";
// Importamos el tipo esperado en el body del login.
import { LoginBody } from "../../types/user.js";

// Controller del login.
// Se encarga de recibir la peticion HTTP, validar lo basico y devolver la respuesta.
export async function loginController(req: Request, res: Response) {
    try{
        // Logs de depuración para comprobar que la petición llega bien.
        console.log("DEBUG: loginController ejecutado");
        console.log("DEBUG: body recibido =", req.body);

        const { email, password } = req.body as LoginBody ?? {};

        // Extraemos el email y el password del body
        const cleanEmail = typeof email === "string" ? email.trim() : "";
        const cleanPassword = typeof password === "string" ? password.trim() : "";

        if(!cleanEmail || !cleanPassword){
            res.status(400).json({
                message: "Faltan datos: email y password son obligatorios.",
            });
            return;
        }

        const result = await loginUser(cleanEmail, cleanPassword);

        if(!result){
            res.status(401).json({
                message: "Crendeciales incorrectas.",
            });
            return;
        }

        res.status(200).json(result);
    }catch (error){
        console.error("Error en loginController:", error);

        res.status(500).json({
            message: "Error interno del servidor.",
        });
    }
};