export interface CreateUserBodyType {
    company_id: number;
    group_id: number;
    email: string;
    name: string;
    role: "USER" | "ADMINISTRATOR";
    job_title: string;
    password: string;
    is_active: number;
}