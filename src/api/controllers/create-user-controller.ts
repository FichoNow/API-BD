import { Request, Response } from "express";
import { createUserService } from "../../services/create-user-service.js";
import { CreateUserBodyType } from "../../types/users/create-user-body-type.js";

/**
 * Controller encargado de gestionar la creación de un usuario nuevo.
 * 
 * Su responsabilidad es:
 * - leer el body de la petición
 * - validar que estén todos los campos obligatorios
 * - llamar al service correspondiente
 * - devolver la respuesta HTTP adecuada
 */
 export async function createUserController(req: Request, res: Response) {
    try {
        const {
            company_id,
            group_id,
            email,
            name,
            role,
            job_title,
            password,
            is_active,
        } = req.body as CreateUserBodyType;

        // Validación básica: comprobamos que no falten campos oligatorios.
        if (
            company_id === undefined ||
            group_id === undefined ||
            !email ||
            !name ||
            !role ||
            !job_title ||
            !password ||
            is_active === undefined
        ) {
            res.status(400).json({ message: "Faltan campos obligatorios para crear el usuario." });
            return;
        }

        const result = await createUserService({
            company_id,
            group_id,
            email,
            name,
            role,
            job_title,
            password,
            is_active,
        });

        res.status(201).json(result);
        
    }catch (error) {
        // Si el email ya existe, devolvemos conflicto.
        if(error instanceof Error && error.message === "Ya existe un usuario con ese email.") {
            res.status(409).json({
                message: error.message,
            });
            return;
        }

        console.error("Error en createUserController:", error);

        res.status(500).json({
            message: "Error interno del servidor.",
        });
    }
 }