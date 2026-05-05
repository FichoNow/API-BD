/** Forma pura de los datos de una empresa, sin index signature de RowDataPacket. */
export interface CompanyData {
  id: number;
  name: string;
  cif_nif: string;
  email: string;
  address_line: string;
  city: string;
  postal_code: string;
  owner_id: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
