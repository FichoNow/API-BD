import { UserData } from "../../models/user.js";

export type CreateUserResponse = Pick<
  UserData,
  | "id"
  | "company_id"
  | "group_id"
  | "email"
  | "name"
  | "role"
  | "job_title"
  | "is_active"
>;
