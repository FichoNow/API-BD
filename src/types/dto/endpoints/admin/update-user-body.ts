import { UserRow } from "../../../db/user-row-type.js";

export type UpdateUserBody = Partial<
  Pick<
    UserRow,
    | "group_id"
    | "email"
    | "name"
    | "role"
    | "job_title"
    | "password"
    | "is_active"
  >
>;
