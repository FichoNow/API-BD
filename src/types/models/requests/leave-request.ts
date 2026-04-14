export type LeaveRequestType =
    | "VACATION"
    | "PERMISSION"
    | "SICK_LEAVE"
    | "MEDICAL_APPOINTMENT"
    | "DAY_OFF";

export type LeaveRequestStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "CANCELLED";

/** Forma pura de los datos de una solicitud de ausencia, sin index signature de RowDataPacket. */
export interface LeaveRequestData {
    id: number;
    user_id: number;
    type: LeaveRequestType;
    start_date: string;
    end_date: string;
    start_time: string | null;
    end_time: string | null;
    comment: string | null;
    status: LeaveRequestStatus;
    reviewed_by: number | null;
    reviewed_at: Date | null;
    review_comment: string | null;
    created_at: Date;
    updated_at: Date;
}
