import { UserData } from "../../models/user.js";

export type UpdateUserResponse = Pick<
  UserData,
  | "id"
  | "name"
  | "email"
  | "role"
  | "job_title"
  | "group_id"
  | "is_active"
  | "updated_at"
>;
