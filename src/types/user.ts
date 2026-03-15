// Posibles roles que puede tener un usuario dentro del sistema.
export type UserRole = "USER" | "ADMINISTRATOR";

// Estructura esperada en el boy de la petición de login.
// El usuario desde la app enviaría estos dos campos.
export interface LoginBody {
    email: string;
    password: string;
}

// Estructura del usuario tal como viene desde la bbdd.
// He incluido el campo "is_active" porque lo usaré para validar el login.
export interface DbUser {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    password_hash: string;
    is_active: number;
}

// Estructura de la respuesta del login si sale bien.
export interface LoginResponse {
    message: string;
    user: {
        name: string;
        role: UserRole;
    };
}