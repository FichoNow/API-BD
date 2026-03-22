import { RowDataPacket } from "mysql2";

/** Representa una fila de la tabla `companies` tal como la devuelve la base de datos. */
export interface CompanyRow extends RowDataPacket {
  id: number;
  name: string;
  vat_number: string;
  email: string;
  phone: string;
  address_line1: string;
  city: string;
  region: string;
  postal_code: string;
  country_code: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
