import { createUser, findUserByEmail, findUSerByEmail } from "../database/repositories/user-repository.js";
import { CreateUserBodyType } from "../types/auth/create-user-body-type.js";
import { CreateUserResponseType } from "../types/users/create-user-response-type.js";
import {hashPassword } from "./password-hash-service.js";

/**
 * Lógica de negocio para crear un usuario nuevo.
 * Recibe los datos del nuevo usuario, comprueba que el email no esté registrado,
 * genera el hash de la contraseña y crea el usuario en base de datos.
 * Devuelve los datos del usuario creado.
 * @param userData Datos del nuevo usuario a crear.
 * @returns Los datos del usuario creado.
 */
export const createUserService = async (body: CreateUserBodyType): Promise<CreateUserResponseType> => {
    // Limpiamos algunos campos de texto.
    const cleanEmail = body.email.trim().toLowerCase();
    const cleanName = body.name.trim();
    const cleanJobTitle = body.job_title.trim();

    // Comprobamos si ya existe el usuario con ese email.
    const existeUSer = await findUserByEmail(cleanEmail);

    if(existeUSer){
        throw new Error("Ya existe un usuario con ese email.");
    }

    // Hasheamos la contraseña antes de guardar el usuario.
    const passwordHash = await hashPassword(body.password);

    // Llamamos al repository para insertar el nuevo usuario.
    const newUser = await createUser({
        company_id: body.company_id,
        group_id: body.group_id,
        email: cleanEmail,
        name: cleanName,
        role: body.role,
        job_title: cleanJobTitle,
        password_hash: passwordHash,
        is_active: body.is_active,
    });

    // Devolvemos la respuesta final que recibirá el cliente.
    return {
        message: "Usuario creado correctamente.",
        user: {
            id: newUser.id,
            company_id: newUser.company_id,
            group_id: newUser.group_id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            job_title: newUser.job_title,
            is_active: newUser.is_active,   
        },
    };
};