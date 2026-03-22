/** Forma pura de los datos de una empresa, sin index signature de RowDataPacket. */
export interface CompanyData {
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
