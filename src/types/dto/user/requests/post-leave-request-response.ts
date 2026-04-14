import { LeaveRequestData } from "../../../models/requests/leave-request.js";

/** Lo que devuelve la API al crear una solicitud correctamente. */
export type PostLeaveRequestResponse = Pick<LeaveRequestData, "id">;
