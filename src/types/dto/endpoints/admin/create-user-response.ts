import { UserRow } from "../../../db/user-row-type.js";

export type CreateUserResponse = Pick<
  UserRow,
  | "id"
  | "company_id"
  | "group_id"
  | "email"
  | "name"
  | "role"
  | "job_title"
  | "is_active"
>;