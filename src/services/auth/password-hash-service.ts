import argon2 from "argon2";

/**
 * Genera el hash seguro de una contraseña en texto plano.
 * Esta función se usará al crear un usuario nuevo.
 * @param password Contraseña en texto plano a hashear.
 * @returns El hash seguro de la contraseña.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password);
};

/**
 * Comprueba si una contraseña en texto plano coincide con su hash.
 * Esta función se usará en el login.
 * @param password Contraseña en texto plano recibida en la petición.
 * @param passwordHash Hash almacenado en base de datos.
 * @returns `true` si la contraseña coincide, `false` si no.
 */
export const verifyPassword = async (
    password: string,
    passwordHash: string
): Promise<boolean> => {
    return await argon2.verify(passwordHash, password);
};