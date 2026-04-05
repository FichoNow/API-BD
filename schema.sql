CREATE DATABASE IF NOT EXISTS BD_Jan_Fran;
USE BD_Jan_Fran;

/* ============= Borrado de tablas =============*/
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS attendance_daily_summary;
DROP TABLE IF EXISTS calendar_exceptions;
DROP TABLE IF EXISTS user_schedule_assignments;
DROP TABLE IF EXISTS group_schedule_assignments;
DROP TABLE IF EXISTS work_schedule_template_days;
DROP TABLE IF EXISTS work_schedule_templates;

DROP TABLE IF EXISTS fichaje_breaks;
DROP TABLE IF EXISTS fichaje_entries;
DROP TABLE IF EXISTS fichajes;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS work_groups;
DROP TABLE IF EXISTS companies;

/* ============= Tabla companies =============*/
CREATE TABLE companies (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    cif_nif VARCHAR(50) NOT NULL,
    email VARCHAR(254) NOT NULL,
    address_line VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_companies_name (name),
    UNIQUE KEY uq_companies_cif_nif (cif_nif)
);

/* ============= Tabla work_groups =============*/
CREATE TABLE work_groups (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    company_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_groups_company_name (company_id, name),
    CONSTRAINT fk_groups_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE
);

/* ============= Tabla users =============*/
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    group_id INT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role ENUM('USER','ADMINISTRATOR') NOT NULL,
    password_hash VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_users_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_users_group
        FOREIGN KEY (group_id) REFERENCES work_groups(id)
        ON DELETE SET NULL
);

/* ============= Tabla refresh_tokens =============*/
CREATE TABLE refresh_tokens (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_refresh_tokens_token_hash (token_hash),
    KEY idx_refresh_tokens_user_id (user_id),
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

/* ============= Tabla projects =============*/
CREATE TABLE projects (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    group_id INT NULL,
    name VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_projects_company_name (company_id, name),
    CONSTRAINT fk_projects_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_projects_group
        FOREIGN KEY (group_id) REFERENCES work_groups(id)
        ON DELETE SET NULL
);

/* ============= Tabla fichajes =============*/
CREATE TABLE fichajes (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    clock_in DATETIME NOT NULL,
    clock_out DATETIME NULL DEFAULT NULL,
    clock_in_modified BOOLEAN NOT NULL DEFAULT FALSE,
    clock_out_modified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_fichajes_user_clock_in (user_id, clock_in),
    CONSTRAINT fk_fichajes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

/* ============= Tabla fichaje_entries =============*/
CREATE TABLE fichaje_entries (
    id INT NOT NULL AUTO_INCREMENT,
    fichaje_id INT NOT NULL,
    project_id INT NOT NULL,
    started_at DATETIME NOT NULL,
    ended_at DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_fichaje_entries_fichaje
        FOREIGN KEY (fichaje_id) REFERENCES fichajes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_fichaje_entries_project
        FOREIGN KEY (project_id) REFERENCES projects(id)
        ON DELETE CASCADE
);

/* ============= Tabla fichaje_breaks =============*/
CREATE TABLE fichaje_breaks (
    id INT NOT NULL AUTO_INCREMENT,
    fichaje_id INT NOT NULL,
    started_at DATETIME NOT NULL,
    ended_at DATETIME NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_fichaje_breaks_fichaje
        FOREIGN KEY (fichaje_id) REFERENCES fichajes(id)
        ON DELETE CASCADE
);

/* ============= Plantillas de horario =============*/
CREATE TABLE work_schedule_templates (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(255) NULL,
    weekly_minutes INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_schedule_template_company_name (company_id, name),
    CONSTRAINT fk_schedule_templates_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE
);

/* ============= Días de plantilla =============*/
CREATE TABLE work_schedule_template_days (
    id INT NOT NULL AUTO_INCREMENT,
    template_id INT NOT NULL,
    weekday TINYINT NOT NULL, -- 1=Lunes ... 7=Domingo
    is_working_day BOOLEAN NOT NULL DEFAULT TRUE,
    start_time TIME NULL,
    end_time TIME NULL,
    break_minutes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_template_weekday (template_id, weekday),
    CONSTRAINT fk_template_days_template
        FOREIGN KEY (template_id) REFERENCES work_schedule_templates(id)
        ON DELETE CASCADE
);

/* ============= Asignación de horario a grupos =============*/
CREATE TABLE group_schedule_assignments (
    id INT NOT NULL AUTO_INCREMENT,
    group_id INT NOT NULL,
    template_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_group_schedule_dates (group_id, start_date, end_date),
    CONSTRAINT fk_group_schedule_group
        FOREIGN KEY (group_id) REFERENCES work_groups(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_group_schedule_template
        FOREIGN KEY (template_id) REFERENCES work_schedule_templates(id)
        ON DELETE CASCADE
);

/* ============= Asignación de horario a usuarios =============*/
CREATE TABLE user_schedule_assignments (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    template_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_user_schedule_dates (user_id, start_date, end_date),
    CONSTRAINT fk_user_schedule_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_user_schedule_template
        FOREIGN KEY (template_id) REFERENCES work_schedule_templates(id)
        ON DELETE CASCADE
);

/* ============= Excepciones calendario =============*/
CREATE TABLE calendar_exceptions (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    user_id INT NULL,
    group_id INT NULL,
    type ENUM(
        'HOLIDAY',
        'VACATION',
        'SICK_LEAVE',
        'PERMISSION',
        'DAY_OFF',
        'SPECIAL_SHIFT'
    ) NOT NULL,
    title VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    notes VARCHAR(255) NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_calendar_exceptions_dates (start_date, end_date),
    CONSTRAINT fk_calendar_exceptions_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_calendar_exceptions_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_calendar_exceptions_group
        FOREIGN KEY (group_id) REFERENCES work_groups(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_calendar_exceptions_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE CASCADE
);

/* ============= Solicitudes de usuario (vacaciones, médico, permisos...) =============*/
CREATE TABLE leave_requests (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM(
        'VACATION',
        'PERMISSION',
        'SICK_LEAVE',
        'MEDICAL_APPOINTMENT',
        'DAY_OFF'
    ) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    comment VARCHAR(255) NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    review_comment VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_leave_requests_user_status (user_id, status),
    KEY idx_leave_requests_dates (start_date, end_date),
    CONSTRAINT fk_leave_requests_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_leave_requests_reviewed_by
        FOREIGN KEY (reviewed_by) REFERENCES users(id)
        ON DELETE SET NULL
);

/* ============= Resumen diario =============*/
CREATE TABLE attendance_daily_summary (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    summary_date DATE NOT NULL,
    planned_start_time TIME NULL,
    planned_end_time TIME NULL,
    planned_minutes INT NOT NULL DEFAULT 0,
    worked_minutes INT NOT NULL DEFAULT 0,
    overtime_minutes INT NOT NULL DEFAULT 0,
    delay_minutes INT NOT NULL DEFAULT 0,
    status ENUM(
        'PLANNED',
        'WORKED',
        'ABSENT',
        'HOLIDAY',
        'VACATION',
        'SICK_LEAVE',
        'PERMISSION',
        'DAY_OFF',
        'INCIDENT'
    ) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_daily_summary_user_date (user_id, summary_date),
    CONSTRAINT fk_daily_summary_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

/* ========================================================= */
/* ================= INSERTS ================================ */
/* ========================================================= */

INSERT INTO companies (
    name, cif_nif, email, address_line, city, postal_code
) VALUES (
    'Empresa Demo', 'B12345678', 'contacto@empresa.com',
    'Calle Principal 123', 'Barcelona', '08001'
);

INSERT INTO work_groups (name, company_id) VALUES
('Dirección', 1),
('Operaciones', 1);

-- Contraseñas: admin → '1' | empleado1 → 'password123' | empleado2 → 'password123'
INSERT INTO users (company_id, group_id, email, name, role, is_active, password_hash) VALUES
(1, 1, 'admin@empresa.com',     'Admin',        'ADMINISTRATOR', TRUE, '$argon2id$v=19$m=65536,t=3,p=4$lpu2IkLFjApNUpwvlcj8gw$ailSD22G2mxIbBCroN2XC/uHAPWfNnsYPhqPahd4Qyk'),
(1, 2, 'empleado1@empresa.com', 'Empleado Uno', 'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$BceHtK70GVXGUHFdIjlLeQ$22lGigeJ/Q9lzELEevPzKbqkLHiocSCUk1rQN+XoSgs'),
(1, 2, 'empleado2@empresa.com', 'Empleado Dos', 'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$UMbRhJqUylJwjEimExOt9A$t8FPm6DSlJdrKnxt/vbXmW03zeI9RhMsJ7CAJPsRWQ4');

/* Proyectos */
INSERT INTO projects (company_id, group_id, name, is_active) VALUES
(1, NULL, 'Proyecto General', TRUE),
(1, 2, 'Soporte', TRUE);

/* Plantillas */
INSERT INTO work_schedule_templates (company_id, name, description, weekly_minutes, is_active) VALUES
(1, 'Horario Oficina', 'Horario estándar de lunes a viernes', 2400, TRUE),
(1, 'Horario Intensivo', 'Horario intensivo de verano', 2100, TRUE);

/* Días plantilla: Horario Oficina */
INSERT INTO work_schedule_template_days (template_id, weekday, is_working_day, start_time, end_time, break_minutes) VALUES
(1, 1, TRUE,  '09:00:00', '18:00:00', 60),
(1, 2, TRUE,  '09:00:00', '18:00:00', 60),
(1, 3, TRUE,  '09:00:00', '18:00:00', 60),
(1, 4, TRUE,  '09:00:00', '18:00:00', 60),
(1, 5, TRUE,  '09:00:00', '18:00:00', 60),
(1, 6, FALSE, NULL, NULL, 0),
(1, 7, FALSE, NULL, NULL, 0);

/* Días plantilla: Horario Intensivo */
INSERT INTO work_schedule_template_days (template_id, weekday, is_working_day, start_time, end_time, break_minutes) VALUES
(2, 1, TRUE,  '08:00:00', '15:00:00', 0),
(2, 2, TRUE,  '08:00:00', '15:00:00', 0),
(2, 3, TRUE,  '08:00:00', '15:00:00', 0),
(2, 4, TRUE,  '08:00:00', '15:00:00', 0),
(2, 5, TRUE,  '08:00:00', '15:00:00', 0),
(2, 6, FALSE, NULL, NULL, 0),
(2, 7, FALSE, NULL, NULL, 0);

/* Asignación de horario al grupo Operaciones */
INSERT INTO group_schedule_assignments (group_id, template_id, start_date, end_date) VALUES
(2, 1, '2026-01-01', '2026-06-30'),
(2, 2, '2026-07-01', '2026-08-31'),
(2, 1, '2026-09-01', NULL);

/* Asignación individual al admin */
INSERT INTO user_schedule_assignments (user_id, template_id, start_date, end_date) VALUES
(1, 1, '2026-01-01', NULL);

/* Excepciones de calendario */
INSERT INTO calendar_exceptions (
    company_id, user_id, group_id, type, title, start_date, end_date, start_time, end_time, notes, created_by
) VALUES
(1, NULL, NULL, 'HOLIDAY', 'Navidad', '2026-12-25', '2026-12-25', NULL, NULL, 'Festivo nacional', 1),
(1, NULL, NULL, 'HOLIDAY', 'Año Nuevo', '2026-01-01', '2026-01-01', NULL, NULL, 'Festivo nacional', 1),
(1, 2, NULL, 'VACATION', 'Vacaciones verano', '2026-08-10', '2026-08-14', NULL, NULL, 'Vacaciones aprobadas', 1),
(1, 3, NULL, 'PERMISSION', 'Permiso médico', '2026-04-15', '2026-04-15', '09:00:00', '11:00:00', 'Consulta médica', 1),
(1, NULL, 2, 'SPECIAL_SHIFT', 'Jornada reducida operaciones', '2026-05-20', '2026-05-20', '08:00:00', '14:00:00', 'Cambio puntual de turno', 1);

/* Solicitudes de usuarios */
INSERT INTO leave_requests (
    user_id, type, start_date, end_date, start_time, end_time, comment, status, reviewed_by, reviewed_at, review_comment
) VALUES
(2, 'VACATION', '2026-08-10', '2026-08-14', NULL, NULL, 'Vacaciones de verano', 'APPROVED', 1, '2026-04-01 10:00:00', 'Aprobado'),
(3, 'MEDICAL_APPOINTMENT', '2026-04-18', '2026-04-18', '10:00:00', '12:00:00', 'Cita con especialista', 'PENDING', NULL, NULL, NULL),
(2, 'DAY_OFF', '2026-05-02', '2026-05-02', NULL, NULL, 'Asunto personal', 'REJECTED', 1, '2026-04-03 12:30:00', 'No hay cobertura ese día');

/* Fichajes ejemplo */
INSERT INTO fichajes (user_id, clock_in, clock_out, clock_in_modified, clock_out_modified) VALUES
(2, '2026-04-01 09:02:00', '2026-04-01 18:01:00', FALSE, FALSE),
(3, '2026-04-01 09:15:00', '2026-04-01 17:50:00', FALSE, FALSE),
(2, '2026-04-02 08:58:00', '2026-04-02 18:05:00', FALSE, FALSE);

/* Reparto de tiempo por proyecto */
INSERT INTO fichaje_entries (fichaje_id, project_id, started_at, ended_at) VALUES
(1, 1, '2026-04-01 09:02:00', '2026-04-01 13:00:00'),
(1, 2, '2026-04-01 14:00:00', '2026-04-01 18:01:00'),
(2, 2, '2026-04-01 09:15:00', '2026-04-01 17:50:00'),
(3, 1, '2026-04-02 08:58:00', '2026-04-02 18:05:00');

/* Resumen diario ejemplo */
INSERT INTO attendance_daily_summary (
    user_id, summary_date, planned_start_time, planned_end_time, planned_minutes, worked_minutes, overtime_minutes, delay_minutes, status
) VALUES
(2, '2026-04-01', '09:00:00', '18:00:00', 480, 479, 0, 2, 'WORKED'),
(3, '2026-04-01', '09:00:00', '18:00:00', 480, 455, 0, 15, 'INCIDENT'),
(2, '2026-04-02', '09:00:00', '18:00:00', 480, 487, 7, 0, 'WORKED'),
(2, '2026-08-11', NULL, NULL, 0, 0, 0, 0, 'VACATION'),
(3, '2026-12-25', NULL, NULL, 0, 0, 0, 0, 'HOLIDAY');