import { WorkGroupData } from "../../models/work-group.js";

/** Respuesta del endpoint POST /admin/group y PATCH /admin/group/:id. */
export type GroupResponse = WorkGroupData;

/** Respuesta del endpoint GET /admin/groups. */
export type GroupsListResponse = WorkGroupData[];
