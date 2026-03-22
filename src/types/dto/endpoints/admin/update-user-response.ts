import { UserRow } from "../../../db/user-row-type.js";

export type UpdateUserResponse = Pick<
  UserRow,
  "id" | "name" | "email" | "role" | "job_title" | "group_id" | "is_active" | "updated_at"
>;
