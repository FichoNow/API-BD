// Importamos funciones del repository para buscar usuario y actualizar el último acceso.
import { findUserByEmail, updateLastLoginAt } from "../database/repositories/user-repository.js";
// Importamos el tipo de respuesta exitosa del login.
import { LoginResponse } from "../types/user.js";

// Función de la lógica del login:
// Recibe un email y password para decidir si el login es válido.
export async function loginUser(email: string, password: string): Promise<LoginResponse | null> {
    // Buscamos al usuario en la base de datos por email.
    const user = await findUserByEmail(email);
    // También si no existe, que devuelva null.
    if(!user){
        return null;
    }

    //Ahora mismo el password es texto plano pero más adelante será hash. Tenemos que cambiarlo!
    if(user.password_hash !== password){
        return null;
    }

    // Si el login ha salido bien, actualizamos el campo de "last_login_at".
    await updateLastLoginAt(user.id);

    // Devolvemos solo los datos que nos interesan (por ahora) para enviarselos al usuario.
    return{
        message: "Login correcto.",
        user: {
            name: user.name,
            role: user.role,
        },
    };
};