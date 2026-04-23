import { RowDataPacket } from "mysql2";
import { CompanyData } from "../models/company.js";

/** Representa una fila de la tabla `companies` tal como la devuelve la base de datos. */
export interface CompanyRow extends RowDataPacket, CompanyData {}

/** Campos necesarios para insertar una nueva empresa en la tabla `companies`. Solo incluye los que el cliente puede proporcionar — `is_active`, `created_at` y `updated_at` los pone el repositorio. */
export type CreateCompanyRow = Pick<CompanyData, "name" | "cif_nif" | "email" | "address_line" | "city" | "postal_code">;
