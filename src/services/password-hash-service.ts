import argon2 from "argon2";

/**
 * Genera el hash seguro de una contraseña en texto plano.
 * Esta función se usará al crear un usuario nuevo.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return await argon2.hash(password);
};

/** 
 * Comprueba si una contraseña en texto plaano coincide con su hash.
 * Esta función se usará en el login.
*/
export const verifyPassword = async (
    password: string,
    passwordHash: string
): Promise<boolean> => {
    return await argon2.verify(passwordHash, password);
};