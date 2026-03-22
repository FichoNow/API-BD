import { RowDataPacket } from "mysql2";
import { CompanyData } from "../models/company.js";

/** Representa una fila de la tabla `companies` tal como la devuelve la base de datos. */
export interface CompanyRow extends RowDataPacket, CompanyData {}
