import { UserRow } from "../../../db/user-row-type.js";

export type UpdateSelfResponse = Pick<
  UserRow,
  "id" | "name" | "email" | "updated_at"
>;
