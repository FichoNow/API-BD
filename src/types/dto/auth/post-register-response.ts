import { CompanyData } from "../../models/company.js";
import { UserData } from "../../models/user.js";

/**
 * Lo que devuelve la API al registrar una empresa correctamente.
 *
 * Incluye los datos básicos de la empresa creada y del usuario SUPERADMIN generado.
 * No incluye tokens — el usuario debe hacer login a continuación.
 */
export interface PostRegisterResponse {
  company: Pick<CompanyData, "id" | "name" | "cif_nif" | "email" | "address_line" | "city" | "postal_code">;
  user: Pick<UserData, "id" | "name" | "email" | "role">;
}
