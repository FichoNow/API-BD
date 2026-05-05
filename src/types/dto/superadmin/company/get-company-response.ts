import { CompanyData } from "../../../models/company.js";

export type GetCompanyResponse = Pick<
  CompanyData,
  "id" | "name" | "cif_nif" | "email" | "address_line" | "city" | "postal_code" | "owner_id"
>;
