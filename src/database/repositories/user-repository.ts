// Importamos el pool de conexión a MySQL.
import { pool } from "../pool.js";
// Importamos el tipo que representa un usuario leído desde la base de datos.
import { DbUser } from "../../types/user.js";

// Buscamos un usuario por su email.
// Devuelve el usuario si lo encuentra, o null si no existe en la bbdd!
export async function findUserByEmail(email: string): Promise<DbUser | null> {
    // Aquí ejecutamos la consulta SQL, usaremos el email que se nos pasa .
    const [rows] = await pool.query(
        "SELECT id, name, role, password_hash, is_active FROM users WHERE email = ? LIMIT 1", [email]
    );
    // Convertimos el resultado al tipo "DbUser[]". Así lo podemos manejar mejor.
    const users = rows as DbUser[];

    // Si no hay resultado, que devuelva null.
    if (users.length === 0){
        return null;
    }

    // Y si hay usuario, que se devuelva el primero!
    return users[0];
};

// He añadido también que se actualice la fecha y la hora del último login correcto de un usuario!
export async function updateLastLoginAt(userId: number) {
    await pool.query("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?", [userId]);
};

