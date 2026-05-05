CREATE DATABASE IF NOT EXISTS BD_Jan_Fran;
USE BD_Jan_Fran;

/* ============= Borrado de tablas =============*/
DROP TABLE IF EXISTS excepciones_calendario;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS leave_request_statuses;
DROP TABLE IF EXISTS leave_request_types;
DROP TABLE IF EXISTS tipos_excepcion;

DROP TABLE IF EXISTS asignaciones_usuario;
DROP TABLE IF EXISTS asignaciones_grupo;
DROP TABLE IF EXISTS dias_plantilla;
DROP TABLE IF EXISTS plantillas_horario;

DROP TABLE IF EXISTS fichaje_breaks;
DROP TABLE IF EXISTS fichaje_entries;
DROP TABLE IF EXISTS fichajes;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS work_groups;
DROP TABLE IF EXISTS departments;
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
    owner_id INT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_companies_name (name),
    UNIQUE KEY uq_companies_cif_nif (cif_nif)
);

/* La FK a users se añade después de crear la tabla users (referencia circular) */

/* ============= Tabla departments =============*/
CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_departments_company_name (company_id, name),
    CONSTRAINT fk_departments_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
        ON DELETE CASCADE
);

/* ============= Tabla work_groups =============*/
CREATE TABLE work_groups (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_groups_department_name (department_id, name),
    CONSTRAINT fk_groups_department
        FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE CASCADE
);

/* ============= Tabla users =============*/
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    department_id INT NOT NULL,
    group_id INT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role ENUM('USER','ADMINISTRATOR','SUPERADMIN') NOT NULL,
    password_hash VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_users_department
        FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_users_group
        FOREIGN KEY (group_id) REFERENCES work_groups(id)
        ON DELETE SET NULL
);

/* FK companies.owner_id → users.id (se añade aquí porque es circular) */
ALTER TABLE companies
    ADD CONSTRAINT fk_companies_owner
    FOREIGN KEY (owner_id) REFERENCES users(id)
    ON DELETE SET NULL;

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
    department_id INT NOT NULL,
    group_id INT NULL,
    name VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_projects_department_name (department_id, name),
    CONSTRAINT fk_projects_department
        FOREIGN KEY (department_id) REFERENCES departments(id)
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
CREATE TABLE plantillas_horario (
    id INT NOT NULL AUTO_INCREMENT,
    department_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(255) NULL,
    weekly_minutes INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_schedule_template_department_name (department_id, name),
    CONSTRAINT fk_schedule_templates_department
        FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE CASCADE
);

/* ============= Días de plantilla =============*/
CREATE TABLE dias_plantilla (
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
        FOREIGN KEY (template_id) REFERENCES plantillas_horario(id)
        ON DELETE CASCADE
);

/* ============= Asignación de horario a grupos =============*/
CREATE TABLE asignaciones_grupo (
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
        FOREIGN KEY (template_id) REFERENCES plantillas_horario(id)
        ON DELETE CASCADE
);

/* ============= Asignación de horario a usuarios =============*/
CREATE TABLE asignaciones_usuario (
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
        FOREIGN KEY (template_id) REFERENCES plantillas_horario(id)
        ON DELETE CASCADE
);

/* ============= Tipos de excepción =============*/
CREATE TABLE tipos_excepcion (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tipos_excepcion_code (code)
);

/* ============= Tabla de tipos de solicitud =============*/
CREATE TABLE leave_request_types (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE KEY uq_leave_request_types_code (code)
);

/* ============= Tabla de estados de solicitud =============*/
CREATE TABLE leave_request_statuses (
    id INT NOT NULL AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_leave_request_statuses_code (code)
);

/* ============= Solicitudes de usuario (vacaciones, médico, permisos...) =============*/
CREATE TABLE leave_requests (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME NULL,
    end_time TIME NULL,
    comment VARCHAR(255) NULL,
    status_id INT NOT NULL,
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    review_comment VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_leave_requests_user_status (user_id, status_id),
    KEY idx_leave_requests_dates (start_date, end_date),
    CONSTRAINT fk_leave_requests_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_leave_requests_type
        FOREIGN KEY (type_id) REFERENCES leave_request_types(id),
    CONSTRAINT fk_leave_requests_status
        FOREIGN KEY (status_id) REFERENCES leave_request_statuses(id),
    CONSTRAINT fk_leave_requests_reviewed_by
        FOREIGN KEY (reviewed_by) REFERENCES users(id)
        ON DELETE SET NULL
);

/* ============= Excepciones calendario =============*/
CREATE TABLE excepciones_calendario (
    id INT NOT NULL AUTO_INCREMENT,
    department_id INT NOT NULL,
    user_id INT NULL,
    group_id INT NULL,
    tipo_id INT NOT NULL,
    leave_request_id INT NULL,
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
    KEY idx_excepciones_calendario_dates (start_date, end_date),
    UNIQUE KEY uq_excepciones_calendario_leave_request (leave_request_id),

    CONSTRAINT chk_excepciones_calendario_scope
        CHECK (NOT (user_id IS NOT NULL AND group_id IS NOT NULL)),

    CONSTRAINT fk_excepciones_calendario_department
        FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_excepciones_calendario_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_excepciones_calendario_group
        FOREIGN KEY (group_id) REFERENCES work_groups(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_excepciones_calendario_tipo
        FOREIGN KEY (tipo_id) REFERENCES tipos_excepcion(id),
    CONSTRAINT fk_excepciones_calendario_leave_request
        FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id),
    CONSTRAINT fk_excepciones_calendario_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE CASCADE
);



/* ========================================================= */
/* ================= INSERTS ================================ */
/* ========================================================= */

-- ── Companies ──────────────────────────────────────────────
INSERT INTO companies (name, cif_nif, email, address_line, city, postal_code) VALUES
('Empresa Demo', 'B12345678', 'contacto@empresa.com', 'Calle Principal 123', 'Barcelona', '08001');

-- ── Departments ────────────────────────────────────────────
-- Se elimina Operaciones. Sus usuarios/grupos pasan a Tecnología.
INSERT INTO departments (company_id, name) VALUES
(1, 'Tecnología'),       -- id 1
(1, 'Ventas'),           -- id 2
(1, 'Recursos Humanos'); -- id 3

-- ── Work groups ────────────────────────────────────────────
INSERT INTO work_groups (name, department_id) VALUES
('Backend',   1),  -- id 1
('Frontend',  1),  -- id 2
('Comercial', 2),  -- id 3
('Preventa',  2),  -- id 4
('Selección', 3),  -- id 5
('Logística', 1),  -- id 6 antes Operaciones
('Almacén',   1);  -- id 7 antes Operaciones

-- ── Users ──────────────────────────────────────────────────
-- a@a.com → '1234' | admins → 'admin1' | users → 'user1'
INSERT INTO users (department_id, group_id, email, name, role, is_active, password_hash) VALUES
-- Tecnología (1-4, 10-12, 13-27) — total 22
(1, 1, 'a@a.com',                  'Super Admin',       'SUPERADMIN',    TRUE, '$argon2id$v=19$m=65536,t=3,p=4$gwDYVNxoupQd4QvaE94zQQ$yGkHmZ1zypYGYaCwew3Ykdr0/ffw0bJA/IQgdnC1E6A'),  -- 1: 1234
(1, 1, 'admin.tec@empresa.com',    'Ana Torres',        'ADMINISTRATOR', TRUE, '$argon2id$v=19$m=65536,t=3,p=4$RU6sltkLohcx7yMRMAsOvw$GU+s2BI2upvHCFwyVfDnrPXzcEsLBb/ngldfhZ8vdHk'),  -- 2: admin1
(1, 1, 'dev1@empresa.com',         'Carlos Ruiz',       'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 3: user1
(1, 2, 'dev2@empresa.com',         'Marta Iglesias',    'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 4
(2, 3, 'admin.ventas@empresa.com', 'Pedro Molina',      'ADMINISTRATOR', TRUE, '$argon2id$v=19$m=65536,t=3,p=4$RU6sltkLohcx7yMRMAsOvw$GU+s2BI2upvHCFwyVfDnrPXzcEsLBb/ngldfhZ8vdHk'),  -- 5
(2, 3, 'ventas1@empresa.com',      'Laura Sanz',        'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 6
(2, 4, 'ventas2@empresa.com',      'Javier Campos',     'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 7
(3, 5, 'admin.rrhh@empresa.com',   'Sofía Navarro',     'ADMINISTRATOR', TRUE, '$argon2id$v=19$m=65536,t=3,p=4$RU6sltkLohcx7yMRMAsOvw$GU+s2BI2upvHCFwyVfDnrPXzcEsLBb/ngldfhZ8vdHk'),  -- 8
(3, 5, 'rrhh1@empresa.com',        'David Herrera',     'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 9
(1, 6, 'admin.ops@empresa.com',    'Elena Vidal',       'ADMINISTRATOR', TRUE, '$argon2id$v=19$m=65536,t=3,p=4$RU6sltkLohcx7yMRMAsOvw$GU+s2BI2upvHCFwyVfDnrPXzcEsLBb/ngldfhZ8vdHk'),  -- 10
(1, 6, 'ops1@empresa.com',         'Roberto Jiménez',   'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 11 PROBLEM
(1, 7, 'ops2@empresa.com',         'Nuria Blanco',      'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 12

-- Backend (g1) extra
(1, 1, 'dev3@empresa.com',         'Sergio Cano',       'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 13 MILD
(1, 1, 'dev4@empresa.com',         'Lucía Ortega',      'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 14
(1, 1, 'dev5@empresa.com',         'Mario Reyes',       'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 15

-- Frontend (g2) extra
(1, 2, 'dev6@empresa.com',         'Paula Soler',       'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 16
(1, 2, 'dev7@empresa.com',         'Hugo Romero',       'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 17 MILD
(1, 2, 'dev8@empresa.com',         'Cristina Vega',     'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 18
(1, 2, 'dev9@empresa.com',         'Iván Garrido',      'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 19

-- Logística (g6) extra
(1, 6, 'log1@empresa.com',         'Patricia León',     'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 20
(1, 6, 'log2@empresa.com',         'Andrés Pérez',      'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 21
(1, 6, 'log3@empresa.com',         'Beatriz Ramos',     'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 22 MILD
(1, 6, 'log4@empresa.com',         'Diego Castro',      'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 23

-- Almacén (g7) extra
(1, 7, 'alm1@empresa.com',         'Raquel Núñez',      'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 24
(1, 7, 'alm2@empresa.com',         'Tomás Fuentes',     'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 25 MILD
(1, 7, 'alm3@empresa.com',         'Eva Pascual',       'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 26
(1, 7, 'alm4@empresa.com',         'Óscar Domínguez',   'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 27

-- Ventas Comercial (g3) extra
(2, 3, 'ventas3@empresa.com',      'Alicia Bravo',      'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 28 HIGH
(2, 3, 'ventas4@empresa.com',      'Manuel Cortés',     'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 29 MILD
(2, 3, 'ventas5@empresa.com',      'Sara Marín',        'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 30
(2, 3, 'ventas6@empresa.com',      'Fernando Aguilar',  'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 31

-- Ventas Preventa (g4) extra
(2, 4, 'ventas7@empresa.com',      'Carmen Suárez',     'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 32
(2, 4, 'ventas8@empresa.com',      'Pablo Méndez',      'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 33
(2, 4, 'ventas9@empresa.com',      'Inés Lozano',       'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 34

-- RRHH Selección (g5) extra
(3, 5, 'rrhh2@empresa.com',        'Gema Rivas',        'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 35
(3, 5, 'rrhh3@empresa.com',        'Alejandro Salas',   'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 36 HIGH
(3, 5, 'rrhh4@empresa.com',        'Marina Lara',       'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'),  -- 37
(3, 5, 'rrhh5@empresa.com',        'Adrián Quintana',   'USER',          TRUE, '$argon2id$v=19$m=65536,t=3,p=4$7Mr3vLjVxRIieUTmliBwkQ$/fNeCEn/sg3bP0Ncln3ryoU6iUnu+2ONnajYvy81TnQ'); -- 38

-- Owner: el primer SUPERADMIN registrado en la empresa.
UPDATE companies SET owner_id = 1 WHERE id = 1;

-- ── Projects ───────────────────────────────────────────────
INSERT INTO projects (department_id, group_id, name, is_active) VALUES
(1, NULL, 'Portal Web',          TRUE),  -- id 1
(1, 1,    'App Móvil',           TRUE),  -- id 2
(2, NULL, 'CRM Ventas',          TRUE),  -- id 3
(2, 3,    'Captación Clientes',  TRUE),  -- id 4
(3, NULL, 'Selección Técnicos',  TRUE),  -- id 5
(1, NULL, 'Distribución',        TRUE),  -- id 6
(1, 1,    'API Backoffice',      TRUE),  -- id 7
(1, NULL, 'Dashboard Analytics', TRUE),  -- id 8
(1, 2,    'Mobile iOS',          TRUE),  -- id 9
(1, NULL, 'Refactor Legacy',     TRUE),  -- id 10
(1, NULL, 'Migración Cloud',     TRUE),  -- id 11
(2, 3,    'Renovaciones',        TRUE),  -- id 12
(2, 4,    'Upselling',           TRUE),  -- id 13
(2, NULL, 'Tier Premium',        TRUE),  -- id 14
(3, NULL, 'Onboarding',          TRUE),  -- id 15
(3, NULL, 'Formación Interna',   TRUE);  -- id 16

-- ── Schedule templates ─────────────────────────────────────
INSERT INTO plantillas_horario (department_id, name, description, weekly_minutes, is_active) VALUES
(1, 'Horario Tecnología', 'Lunes a viernes, horario partido',   2400, TRUE), -- id 1
(1, 'Verano Tecnología',  'Julio-agosto, jornada intensiva',    2100, TRUE), -- id 2
(2, 'Horario Ventas',     'Lunes a sábado, turno mañana',       2700, TRUE), -- id 3
(3, 'Horario RRHH',       'Lunes a viernes, viernes intensivo', 2400, TRUE); -- id 4

-- Tecnología – horario partido
INSERT INTO dias_plantilla (template_id, weekday, is_working_day, start_time, end_time, break_minutes) VALUES
(1,1,TRUE,'09:00:00','18:00:00',60),(1,2,TRUE,'09:00:00','18:00:00',60),
(1,3,TRUE,'09:00:00','18:00:00',60),(1,4,TRUE,'09:00:00','18:00:00',60),
(1,5,TRUE,'09:00:00','18:00:00',60),(1,6,FALSE,NULL,NULL,0),(1,7,FALSE,NULL,NULL,0);

-- Tecnología – verano intensivo
INSERT INTO dias_plantilla (template_id, weekday, is_working_day, start_time, end_time, break_minutes) VALUES
(2,1,TRUE,'08:00:00','15:00:00',0),(2,2,TRUE,'08:00:00','15:00:00',0),
(2,3,TRUE,'08:00:00','15:00:00',0),(2,4,TRUE,'08:00:00','15:00:00',0),
(2,5,TRUE,'08:00:00','15:00:00',0),(2,6,FALSE,NULL,NULL,0),(2,7,FALSE,NULL,NULL,0);

-- Ventas – lun–sáb mañana
INSERT INTO dias_plantilla (template_id, weekday, is_working_day, start_time, end_time, break_minutes) VALUES
(3,1,TRUE,'09:00:00','14:30:00',0),(3,2,TRUE,'09:00:00','14:30:00',0),
(3,3,TRUE,'09:00:00','14:30:00',0),(3,4,TRUE,'09:00:00','14:30:00',0),
(3,5,TRUE,'09:00:00','14:30:00',0),(3,6,TRUE,'09:00:00','14:00:00',0),(3,7,FALSE,NULL,NULL,0);

-- RRHH – partido con viernes intensivo
INSERT INTO dias_plantilla (template_id, weekday, is_working_day, start_time, end_time, break_minutes) VALUES
(4,1,TRUE,'09:00:00','18:00:00',60),(4,2,TRUE,'09:00:00','18:00:00',60),
(4,3,TRUE,'09:00:00','18:00:00',60),(4,4,TRUE,'09:00:00','18:00:00',60),
(4,5,TRUE,'09:00:00','14:00:00',0),(4,6,FALSE,NULL,NULL,0),(4,7,FALSE,NULL,NULL,0);

-- ── Group schedule assignments ─────────────────────────────
INSERT INTO asignaciones_grupo (group_id, template_id, start_date, end_date) VALUES
(1, 1, '2026-01-01', '2026-06-30'),  -- Backend → Tecnología
(1, 2, '2026-07-01', '2026-08-31'),  -- Backend → Verano
(1, 1, '2026-09-01', NULL),          -- Backend → vuelta Tecnología
(2, 1, '2026-01-01', NULL),          -- Frontend → Tecnología
(3, 3, '2026-01-01', NULL),          -- Comercial → Ventas
(4, 3, '2026-01-01', NULL),          -- Preventa → Ventas
(5, 4, '2026-01-01', NULL),          -- Selección → RRHH
(6, 1, '2026-01-01', NULL),          -- Logística → Tecnología
(7, 1, '2026-01-01', NULL);          -- Almacén → Tecnología

-- ── User schedule assignments ──────────────────────────────
INSERT INTO asignaciones_usuario (user_id, template_id, start_date, end_date) VALUES
(1, 1, '2026-01-01', NULL);  -- SUPERADMIN → Tecnología

-- ── Lookup tables ──────────────────────────────────────────
INSERT INTO tipos_excepcion (code, name) VALUES
('HOLIDAY',             'Festivo'),
('VACATION',            'Vacaciones'),
('SICK_LEAVE',          'Baja por enfermedad'),
('PERMISSION',          'Permiso'),
('DAY_OFF',             'Día libre'),
('SPECIAL_SHIFT',       'Turno especial'),
('MEDICAL_APPOINTMENT', 'Cita médica');

INSERT INTO leave_request_types (code, name) VALUES
('VACATION',            'Vacaciones'),
('PERMISSION',          'Permiso'),
('SICK_LEAVE',          'Baja por enfermedad'),
('MEDICAL_APPOINTMENT', 'Cita médica'),
('DAY_OFF',             'Día libre');

INSERT INTO leave_request_statuses (code, name) VALUES
('PENDING',   'Pendiente'),
('APPROVED',  'Aprobada'),
('REJECTED',  'Rechazada'),
('CANCELLED', 'Cancelada');


-- ── Leave requests ─────────────────────────────────────────
-- Se meten solicitudes aprobadas/rechazadas/pendientes para que las estadisticas no salgan planas.
-- Las solicitudes aprobadas de dia completo se usan despues para NO generar fichaje ese dia.
INSERT INTO leave_requests (user_id, type_id, start_date, end_date, start_time, end_time, comment, status_id, reviewed_by, reviewed_at, review_comment) VALUES
(3,  1, '2026-08-10', '2026-08-14', NULL,       NULL,       'Vacaciones de verano',              2, 2,  '2026-04-01 10:00:00', 'Aprobado'),
(4,  4, '2026-04-18', '2026-04-18', '10:00:00', '12:00:00', 'Cita con especialista',             1, NULL, NULL,                  NULL),
(3,  5, '2026-05-02', '2026-05-02', NULL,       NULL,       'Asunto personal',                   3, 2,  '2026-04-03 12:30:00', 'No hay cobertura ese dia'),
(6,  1, '2026-07-01', '2026-07-15', NULL,       NULL,       'Vacaciones anuales',                2, 5,  '2026-05-15 09:15:00', 'Aprobado'),
(9,  2, '2026-04-25', '2026-04-25', '08:00:00', '14:00:00', 'Asunto familiar',                   1, NULL, NULL,                  NULL),
(11, 3, '2026-04-20', '2026-04-22', NULL,       NULL,       'Baja medica',                       2, 10, '2026-04-20 09:00:00', 'Justificado'),
(2,  5, '2026-01-23', '2026-01-23', NULL,       NULL,       'Dia libre por compensacion',        2, 1,  '2026-01-10 11:20:00', 'Compensacion de horas extra'),
(6,  1, '2026-02-10', '2026-02-12', NULL,       NULL,       'Vacaciones cortas',                 2, 5,  '2026-01-25 13:00:00', 'Aprobado'),
(7,  3, '2026-03-09', '2026-03-10', NULL,       NULL,       'Gripe',                             2, 5,  '2026-03-09 08:40:00', 'Justificado'),
(12, 2, '2026-03-27', '2026-03-27', NULL,       NULL,       'Permiso personal',                  2, 10, '2026-03-15 16:10:00', 'Aprobado'),
(10, 1, '2026-04-06', '2026-04-07', NULL,       NULL,       'Vacaciones pendientes',             2, 2,  '2026-03-20 09:45:00', 'Aprobado'),
(8,  4, '2026-03-05', '2026-03-05', '11:00:00', '13:00:00', 'Cita medica',                       2, 8,  '2026-02-28 10:30:00', 'Aprobado'),
(4,  2, '2026-10-13', '2026-10-13', NULL,       NULL,       'Mudanza',                           2, 2,  '2026-09-21 12:00:00', 'Aprobado'),
(5,  1, '2026-12-21', '2026-12-23', NULL,       NULL,       'Vacaciones Navidad',                2, 5,  '2026-11-30 10:00:00', 'Aprobado'),
(11, 5, '2026-09-18', '2026-09-18', NULL,       NULL,       'Dia libre por asuntos propios',     2, 10, '2026-09-01 09:10:00', 'Aprobado');

-- ── Calendar exceptions ────────────────────────────────────
-- Festivos demo por departamento + excepciones asociadas a solicitudes aprobadas.
INSERT INTO excepciones_calendario (department_id, user_id, group_id, tipo_id, leave_request_id, title, start_date, end_date, start_time, end_time, notes, created_by) VALUES
-- Festivos Tecnologia
(1, NULL, NULL, 1, NULL, 'Anio Nuevo',              '2026-01-01', '2026-01-01', NULL, NULL, 'Festivo nacional demo', 1),
(1, NULL, NULL, 1, NULL, 'Reyes',                   '2026-01-06', '2026-01-06', NULL, NULL, 'Festivo nacional demo', 1),
(1, NULL, NULL, 1, NULL, 'Viernes Santo',           '2026-04-03', '2026-04-03', NULL, NULL, 'Festivo nacional demo', 1),
(1, NULL, NULL, 1, NULL, 'Dia del Trabajador',      '2026-05-01', '2026-05-01', NULL, NULL, 'Festivo nacional demo', 1),
(1, NULL, NULL, 1, NULL, 'Fiesta Nacional',         '2026-10-12', '2026-10-12', NULL, NULL, 'Festivo nacional demo', 1),
(1, NULL, NULL, 1, NULL, 'Todos los Santos',        '2026-11-02', '2026-11-02', NULL, NULL, 'Festivo observado demo', 1),
(1, NULL, NULL, 1, NULL, 'Constitucion',            '2026-12-07', '2026-12-07', NULL, NULL, 'Festivo observado demo', 1),
(1, NULL, NULL, 1, NULL, 'Inmaculada',              '2026-12-08', '2026-12-08', NULL, NULL, 'Festivo nacional demo', 1),
(1, NULL, NULL, 1, NULL, 'Navidad',                 '2026-12-25', '2026-12-25', NULL, NULL, 'Festivo nacional demo', 1),

-- Festivos Ventas
(2, NULL, NULL, 1, NULL, 'Anio Nuevo',              '2026-01-01', '2026-01-01', NULL, NULL, 'Festivo nacional demo', 5),
(2, NULL, NULL, 1, NULL, 'Reyes',                   '2026-01-06', '2026-01-06', NULL, NULL, 'Festivo nacional demo', 5),
(2, NULL, NULL, 1, NULL, 'Viernes Santo',           '2026-04-03', '2026-04-03', NULL, NULL, 'Festivo nacional demo', 5),
(2, NULL, NULL, 1, NULL, 'Dia del Trabajador',      '2026-05-01', '2026-05-01', NULL, NULL, 'Festivo nacional demo', 5),
(2, NULL, NULL, 1, NULL, 'Fiesta Nacional',         '2026-10-12', '2026-10-12', NULL, NULL, 'Festivo nacional demo', 5),
(2, NULL, NULL, 1, NULL, 'Todos los Santos',        '2026-11-02', '2026-11-02', NULL, NULL, 'Festivo observado demo', 5),
(2, NULL, NULL, 1, NULL, 'Constitucion',            '2026-12-07', '2026-12-07', NULL, NULL, 'Festivo observado demo', 5),
(2, NULL, NULL, 1, NULL, 'Inmaculada',              '2026-12-08', '2026-12-08', NULL, NULL, 'Festivo nacional demo', 5),
(2, NULL, NULL, 1, NULL, 'Navidad',                 '2026-12-25', '2026-12-25', NULL, NULL, 'Festivo nacional demo', 5),

-- Festivos RRHH
(3, NULL, NULL, 1, NULL, 'Anio Nuevo',              '2026-01-01', '2026-01-01', NULL, NULL, 'Festivo nacional demo', 8),
(3, NULL, NULL, 1, NULL, 'Reyes',                   '2026-01-06', '2026-01-06', NULL, NULL, 'Festivo nacional demo', 8),
(3, NULL, NULL, 1, NULL, 'Viernes Santo',           '2026-04-03', '2026-04-03', NULL, NULL, 'Festivo nacional demo', 8),
(3, NULL, NULL, 1, NULL, 'Dia del Trabajador',      '2026-05-01', '2026-05-01', NULL, NULL, 'Festivo nacional demo', 8),
(3, NULL, NULL, 1, NULL, 'Fiesta Nacional',         '2026-10-12', '2026-10-12', NULL, NULL, 'Festivo nacional demo', 8),
(3, NULL, NULL, 1, NULL, 'Todos los Santos',        '2026-11-02', '2026-11-02', NULL, NULL, 'Festivo observado demo', 8),
(3, NULL, NULL, 1, NULL, 'Constitucion',            '2026-12-07', '2026-12-07', NULL, NULL, 'Festivo observado demo', 8),
(3, NULL, NULL, 1, NULL, 'Inmaculada',              '2026-12-08', '2026-12-08', NULL, NULL, 'Festivo nacional demo', 8),
(3, NULL, NULL, 1, NULL, 'Navidad',                 '2026-12-25', '2026-12-25', NULL, NULL, 'Festivo nacional demo', 8),

-- Excepciones de usuarios aprobadas
(1, 3,   NULL, 2, 1,  'Vacaciones verano Carlos',  '2026-08-10', '2026-08-14', NULL,       NULL,       'Vacaciones aprobadas',       2),
(2, 6,   NULL, 2, 4,  'Vacaciones Laura julio',    '2026-07-01', '2026-07-15', NULL,       NULL,       'Vacaciones aprobadas',       5),
(1, 11,  NULL, 3, 6,  'Baja medica Roberto',       '2026-04-20', '2026-04-22', NULL,       NULL,       'Baja justificada',           10),
(1, 2,   NULL, 5, 7,  'Dia libre Ana',             '2026-01-23', '2026-01-23', NULL,       NULL,       'Compensacion aprobada',      1),
(2, 6,   NULL, 2, 8,  'Vacaciones Laura febrero',  '2026-02-10', '2026-02-12', NULL,       NULL,       'Vacaciones aprobadas',       5),
(2, 7,   NULL, 3, 9,  'Baja Javier',               '2026-03-09', '2026-03-10', NULL,       NULL,       'Baja justificada',           5),
(1, 12,  NULL, 4, 10, 'Permiso Nuria',             '2026-03-27', '2026-03-27', NULL,       NULL,       'Permiso aprobado',           10),
(1, 10,  NULL, 2, 11, 'Vacaciones Elena',          '2026-04-06', '2026-04-07', NULL,       NULL,       'Vacaciones aprobadas',       2),
(3, 8,   NULL, 7, 12, 'Cita medica Sofia',         '2026-03-05', '2026-03-05', '11:00:00', '13:00:00', 'Ausencia parcial aprobada',  8),
(1, 4,   NULL, 4, 13, 'Permiso mudanza Marta',     '2026-10-13', '2026-10-13', NULL,       NULL,       'Permiso aprobado',           2),
(2, 5,   NULL, 2, 14, 'Vacaciones Pedro Navidad',  '2026-12-21', '2026-12-23', NULL,       NULL,       'Vacaciones aprobadas',       5),
(1, 11,  NULL, 5, 15, 'Dia libre Roberto',         '2026-09-18', '2026-09-18', NULL,       NULL,       'Asuntos propios aprobado',   10),

-- Cambio puntual de horario para Frontend
(1, NULL, 2,   6, NULL, 'Jornada reducida Frontend','2026-05-20', '2026-05-20', '08:00:00', '14:00:00', 'Cambio puntual',             2);



/* ========================================================= */
/* ===== FICHAJES RICOS Y VARIABLES: TODO 2026 ============= */
/* ========================================================= */
-- Genera fichajes para todo 2026, no solo unos meses.
-- La idea es que el panel de estadisticas tenga datos con pinta real:
--   * meses con distinta carga de trabajo,
--   * festivos sin fichajes,
--   * vacaciones y bajas sin fichaje,
--   * horas extra fuertes en cierres de mes/campanias,
--   * retrasos reales,
--   * salidas antes,
--   * fichajes abiertos,
--   * pausas variables.

DROP PROCEDURE IF EXISTS insertar_fichajes_2026_realistas;

DELIMITER $$

CREATE PROCEDURE insertar_fichajes_2026_realistas()
BEGIN
    DECLARE fecha_actual DATE DEFAULT '2026-01-01';
    DECLARE fin_periodo DATE DEFAULT '2026-12-31';
    DECLARE dow INT;

    WHILE fecha_actual <= fin_periodo DO
        SET dow = DAYOFWEEK(fecha_actual);

        INSERT INTO fichajes (user_id, clock_in, clock_out, clock_in_modified, clock_out_modified)
        SELECT
            x.user_id,
            DATE_ADD(CONCAT(fecha_actual, ' ', x.base_start), INTERVAL x.in_offset MINUTE) AS clock_in,
            CASE
                WHEN x.is_open = 1 THEN NULL
                ELSE DATE_ADD(CONCAT(fecha_actual, ' ', x.base_end), INTERVAL x.out_offset MINUTE)
            END AS clock_out,
            x.clock_in_modified,
            x.clock_out_modified
        FROM (
            SELECT
                u.id AS user_id,

                -- Entrada teorica segun plantilla/grupo.
                CASE
                    WHEN fecha_actual = '2026-05-20' AND u.group_id = 2 THEN '08:00:00'
                    WHEN u.department_id = 1 AND u.group_id = 1 AND fecha_actual BETWEEN '2026-07-01' AND '2026-08-31' THEN '08:00:00'
                    ELSE '09:00:00'
                END AS base_start,

                -- Salida teorica segun plantilla/grupo.
                CASE
                    WHEN fecha_actual = '2026-05-20' AND u.group_id = 2 THEN '14:00:00'
                    WHEN u.department_id = 1 AND u.group_id = 1 AND fecha_actual BETWEEN '2026-07-01' AND '2026-08-31' THEN '15:00:00'
                    WHEN u.department_id = 2 AND dow = 7 THEN '14:00:00'
                    WHEN u.department_id = 2 THEN '14:30:00'
                    WHEN u.department_id = 3 AND dow = 6 THEN '14:00:00'
                    ELSE '18:00:00'
                END AS base_end,

                -- Retrasos/adelantos de entrada. Reproducible (sin RAND).
                -- Distribución suave: la mayoría llega +/- 5 min, pocos retrasos significativos.
                CASE
                    WHEN fecha_actual = '2026-05-20' AND u.group_id = 2 THEN 0
                    WHEN MOD(DAYOFYEAR(fecha_actual) * 19 + u.id * 29, 100)
                         < CASE WHEN u.id IN (4, 7, 11) THEN 9 WHEN u.id IN (3, 6, 22) THEN 6 ELSE 3 END
                        THEN 18 + MOD(DAYOFYEAR(fecha_actual) * 7 + u.id * 13, 21)       -- retraso fuerte: 18-38 min
                    WHEN MOD(DAYOFYEAR(fecha_actual) * 19 + u.id * 29, 100)
                         < CASE WHEN u.id IN (4, 7, 11) THEN 25 WHEN u.id IN (3, 6, 22) THEN 18 ELSE 12 END
                        THEN 6 + MOD(DAYOFYEAR(fecha_actual) * 5 + u.id * 11, 13)        -- retraso leve: 6-18 min
                    ELSE -5 + MOD(DAYOFYEAR(fecha_actual) * 3 + u.id * 5, 11)            -- normal: -5 a +5 min
                END AS in_offset,

                -- Salidas: distribución por perfiles para que el cumplimiento legal salga realista.
                --   Problem (id 11): ~83 h/año extras (único que pasa el límite de 80h)
                --   High    (2, 28, 36): ~65-75 h/año
                --   Mild    (3, 6, 13, 17, 22, 25, 29): ~35-50 h/año
                --   Resto (normal): ~5-20 h/año
                CASE
                    WHEN fecha_actual = '2026-05-20' AND u.group_id = 2 THEN 0

                    -- Backend en verano: jornada intensiva 8-15, casi siempre se cumple.
                    WHEN u.department_id = 1 AND u.group_id = 1 AND fecha_actual BETWEEN '2026-07-01' AND '2026-08-31' THEN
                        CASE
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 37 + u.id * 23, 100) < 5
                                THEN 20 + MOD(DAYOFYEAR(fecha_actual) * 11 + u.id * 17, 26)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 37 + u.id * 23, 100) > 92
                                THEN -(15 + MOD(DAYOFYEAR(fecha_actual) * 13 + u.id * 7, 26))
                            ELSE MOD(DAYOFYEAR(fecha_actual) + u.id, 8)
                        END

                    -- PROBLEM: único usuario que pasa el límite legal anual.
                    WHEN u.id = 11 THEN
                        CASE
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 31 + u.id * 17, 100) < 35
                                THEN 30 + MOD(DAYOFYEAR(fecha_actual) * 11 + u.id * 13, 51)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 31 + u.id * 17, 100) < 60
                                THEN 10 + MOD(DAYOFYEAR(fecha_actual) * 7 + u.id * 19, 26)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 41 + u.id * 23, 100) < 5
                                THEN -(15 + MOD(DAYOFYEAR(fecha_actual) * 5 + u.id * 11, 26))
                            ELSE MOD(DAYOFYEAR(fecha_actual) * 3 + u.id, 9)
                        END

                    -- HIGH: cerca del límite pero sin pasarlo.
                    WHEN u.id IN (2, 28, 36) THEN
                        CASE
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 29 + u.id * 23, 100) < 30
                                THEN 25 + MOD(DAYOFYEAR(fecha_actual) * 13 + u.id * 17, 36)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 29 + u.id * 23, 100) < 58
                                THEN 5 + MOD(DAYOFYEAR(fecha_actual) * 7 + u.id * 11, 21)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 37 + u.id * 19, 100) < 7
                                THEN -(15 + MOD(DAYOFYEAR(fecha_actual) * 3 + u.id * 13, 26))
                            ELSE MOD(DAYOFYEAR(fecha_actual) * 5 + u.id, 11)
                        END

                    -- MILD: overtime ocasional, dentro del rango cómodo.
                    WHEN u.id IN (3, 6, 13, 17, 22, 25, 29) THEN
                        CASE
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 23 + u.id * 19, 100) < 18
                                THEN 20 + MOD(DAYOFYEAR(fecha_actual) * 7 + u.id * 13, 26)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 23 + u.id * 19, 100) < 42
                                THEN 5 + MOD(DAYOFYEAR(fecha_actual) * 5 + u.id * 11, 16)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 41 + u.id * 7, 100) < 9
                                THEN -(12 + MOD(DAYOFYEAR(fecha_actual) * 3 + u.id, 28))
                            ELSE MOD(DAYOFYEAR(fecha_actual) * 2 + u.id, 11)
                        END

                    -- NORMAL: gran mayoría. Cierra en hora salvo días puntuales.
                    ELSE
                        CASE
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 19 + u.id * 17, 100) < 6
                                THEN 12 + MOD(DAYOFYEAR(fecha_actual) * 7 + u.id * 11, 21)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 19 + u.id * 17, 100) < 18
                                THEN MOD(DAYOFYEAR(fecha_actual) * 5 + u.id * 7, 11)
                            WHEN MOD(DAYOFYEAR(fecha_actual) * 31 + u.id * 13, 100) < 9
                                THEN -(10 + MOD(DAYOFYEAR(fecha_actual) * 3 + u.id, 26))
                            ELSE MOD(DAYOFYEAR(fecha_actual) + u.id, 7)
                        END
                END AS out_offset,

                -- Fichajes abiertos reales.
                CASE
                    WHEN u.id = 12 AND fecha_actual = '2026-05-29' THEN 1
                    WHEN u.id = 3  AND fecha_actual = '2026-09-30' THEN 1
                    WHEN u.id = 7  AND fecha_actual = '2026-11-27' THEN 1
                    ELSE 0
                END AS is_open,

                -- Algunos fichajes corregidos manualmente.
                CASE WHEN MOD(DAYOFYEAR(fecha_actual) * 23 + u.id * 11, 100) < 4 THEN TRUE ELSE FALSE END AS clock_in_modified,
                CASE WHEN MOD(DAYOFYEAR(fecha_actual) * 17 + u.id * 13, 100) < 3 THEN TRUE ELSE FALSE END AS clock_out_modified

            FROM users u
            WHERE
                -- Calendario laboral: Tecnologia/RRHH lun-vie, Ventas lun-sab.
                (
                    (u.department_id = 2 AND dow BETWEEN 2 AND 7)
                    OR
                    (u.department_id <> 2 AND dow BETWEEN 2 AND 6)
                )

                -- Festivos por departamento: no se ficha.
                AND NOT EXISTS (
                    SELECT 1
                    FROM excepciones_calendario ec
                    INNER JOIN tipos_excepcion te ON te.id = ec.tipo_id
                    WHERE te.code = 'HOLIDAY'
                      AND ec.department_id = u.department_id
                      AND ec.user_id IS NULL
                      AND ec.group_id IS NULL
                      AND fecha_actual BETWEEN ec.start_date AND ec.end_date
                )

                -- Ausencias aprobadas de dia completo: vacaciones, baja, permisos, dia libre.
                AND NOT EXISTS (
                    SELECT 1
                    FROM leave_requests lr
                    INNER JOIN leave_request_statuses lrs ON lrs.id = lr.status_id
                    WHERE lr.user_id = u.id
                      AND lrs.code = 'APPROVED'
                      AND lr.start_time IS NULL
                      AND lr.end_time IS NULL
                      AND fecha_actual BETWEEN lr.start_date AND lr.end_date
                )

                -- Ausencias puntuales no planificadas, para que no todo sea perfecto.
                AND NOT (u.id = 4  AND fecha_actual IN ('2026-02-26', '2026-06-18'))
                AND NOT (u.id = 6  AND fecha_actual IN ('2026-03-24', '2026-11-13'))
                AND NOT (u.id = 7  AND fecha_actual IN ('2026-04-14'))
                AND NOT (u.id = 9  AND fecha_actual IN ('2026-05-11', '2026-10-20'))
                AND NOT (u.id = 12 AND fecha_actual IN ('2026-02-06', '2026-08-24'))
                AND NOT (u.id = 14 AND fecha_actual IN ('2026-03-12', '2026-09-08'))
                AND NOT (u.id = 17 AND fecha_actual IN ('2026-05-19'))
                AND NOT (u.id = 21 AND fecha_actual IN ('2026-04-09', '2026-10-15'))
                AND NOT (u.id = 24 AND fecha_actual IN ('2026-02-13', '2026-07-23'))
                AND NOT (u.id = 30 AND fecha_actual IN ('2026-06-25'))
                AND NOT (u.id = 33 AND fecha_actual IN ('2026-03-04', '2026-11-05'))
                AND NOT (u.id = 37 AND fecha_actual IN ('2026-09-22'))
        ) x;

        SET fecha_actual = DATE_ADD(fecha_actual, INTERVAL 1 DAY);
    END WHILE;
END$$

DELIMITER ;

CALL insertar_fichajes_2026_realistas();

DROP PROCEDURE IF EXISTS insertar_fichajes_2026_realistas;


/* ========================================================= */
/* ===== FICHAJE ENTRIES Y BREAKS ========================== */
/* ========================================================= */

-- Primer tramo de trabajo. En jornadas largas llega hasta antes de comer.
-- Proyecto principal según grupo, rotando entre opciones para que no quede plano.
INSERT INTO fichaje_entries (fichaje_id, project_id, started_at, ended_at)
SELECT
    f.id,
    CASE
        -- Ventas Comercial: Captación / Renovaciones
        WHEN u.department_id = 2 AND u.group_id = 3 THEN
            CASE MOD(u.id, 2) WHEN 0 THEN 12 ELSE 4 END
        -- Ventas Preventa: Upselling / Tier Premium
        WHEN u.department_id = 2 AND u.group_id = 4 THEN
            CASE MOD(u.id, 2) WHEN 0 THEN 14 ELSE 13 END
        -- Ventas resto -> CRM
        WHEN u.department_id = 2 THEN 3
        -- RRHH: Selección / Onboarding / Formación
        WHEN u.department_id = 3 THEN
            CASE MOD(u.id, 3) WHEN 0 THEN 16 WHEN 1 THEN 15 ELSE 5 END
        -- Tech Logística/Almacén -> Distribución
        WHEN u.group_id IN (6, 7) THEN 6
        -- Backend: App Móvil / API Backoffice / Migración Cloud
        WHEN u.group_id = 1 THEN
            CASE MOD(u.id, 3) WHEN 0 THEN 11 WHEN 1 THEN 7 ELSE 2 END
        -- Frontend: Mobile iOS / Portal Web
        WHEN u.group_id = 2 THEN
            CASE MOD(u.id, 2) WHEN 0 THEN 9 ELSE 1 END
        ELSE 1
    END AS project_id,
    f.clock_in,
    CASE
        WHEN f.clock_out IS NULL THEN NULL
        WHEN u.department_id IN (1,3)
             AND TIME(f.clock_out) >= '17:00:00'
             AND NOT (u.department_id = 1 AND u.group_id = 1 AND DATE(f.clock_in) BETWEEN '2026-07-01' AND '2026-08-31')
            THEN DATE_ADD(CONCAT(DATE(f.clock_in), ' 13:15:00'), INTERVAL MOD(f.id * 7, 31) MINUTE)
        ELSE f.clock_out
    END AS ended_at
FROM fichajes f
INNER JOIN users u ON u.id = f.user_id;

-- Segundo tramo de trabajo despues de la pausa, con otro proyecto para variar.
INSERT INTO fichaje_entries (fichaje_id, project_id, started_at, ended_at)
SELECT
    f.id,
    CASE
        -- RRHH: Formación / Selección / Onboarding (rotar diferente del primer tramo)
        WHEN u.department_id = 3 THEN
            CASE MOD(u.id, 3) WHEN 0 THEN 5 WHEN 1 THEN 16 ELSE 15 END
        -- Logística/Almacén: Distribución / Dashboard Analytics
        WHEN u.group_id IN (6, 7) THEN
            CASE MOD(u.id, 2) WHEN 0 THEN 8 ELSE 6 END
        -- Backend: rotar a otro proyecto tech
        WHEN u.group_id = 1 THEN
            CASE MOD(u.id, 4) WHEN 0 THEN 1 WHEN 1 THEN 10 WHEN 2 THEN 8 ELSE 11 END
        -- Frontend: Refactor Legacy / Portal / Dashboard
        WHEN u.group_id = 2 THEN
            CASE MOD(u.id, 3) WHEN 0 THEN 10 WHEN 1 THEN 8 ELSE 1 END
        ELSE 1
    END AS project_id,
    DATE_ADD(
        DATE_ADD(CONCAT(DATE(f.clock_in), ' 13:15:00'), INTERVAL MOD(f.id * 7, 31) MINUTE),
        INTERVAL (45 + MOD(f.id * 11, 31)) MINUTE
    ),
    f.clock_out
FROM fichajes f
INNER JOIN users u ON u.id = f.user_id
WHERE f.clock_out IS NOT NULL
  AND u.department_id IN (1,3)
  AND TIME(f.clock_out) >= '17:00:00'
  AND NOT (u.department_id = 1 AND u.group_id = 1 AND DATE(f.clock_in) BETWEEN '2026-07-01' AND '2026-08-31');

-- Pausas variables de comida para jornadas largas.
INSERT INTO fichaje_breaks (fichaje_id, started_at, ended_at)
SELECT
    f.id,
    DATE_ADD(CONCAT(DATE(f.clock_in), ' 13:15:00'), INTERVAL MOD(f.id * 7, 31) MINUTE),
    DATE_ADD(
        DATE_ADD(CONCAT(DATE(f.clock_in), ' 13:15:00'), INTERVAL MOD(f.id * 7, 31) MINUTE),
        INTERVAL (45 + MOD(f.id * 11, 31)) MINUTE
    )
FROM fichajes f
INNER JOIN users u ON u.id = f.user_id
WHERE u.department_id IN (1, 3)
  AND f.clock_out IS NOT NULL
  AND TIME(f.clock_out) >= '17:00:00'
  AND NOT (u.department_id = 1 AND u.group_id = 1 AND DATE(f.clock_in) BETWEEN '2026-07-01' AND '2026-08-31');

-- Pausa extra por cita medica de Sofia.
INSERT INTO fichaje_breaks (fichaje_id, started_at, ended_at)
SELECT
    f.id,
    '2026-03-05 11:00:00',
    '2026-03-05 13:00:00'
FROM fichajes f
WHERE f.user_id = 8
  AND DATE(f.clock_in) = '2026-03-05'
  AND f.clock_out IS NOT NULL;


/* ========================================================= */
/* ===== CONSULTAS RAPIDAS DE COMPROBACION ================= */
/* ========================================================= */

-- Total de fichajes generados.
SELECT COUNT(*) AS total_fichajes FROM fichajes;

-- Fichajes por usuario.
SELECT
    u.id,
    u.name,
    u.email,
    d.name AS department,
    COUNT(f.id) AS total_fichajes
FROM users u
LEFT JOIN departments d ON d.id = u.department_id
LEFT JOIN fichajes f ON f.user_id = u.id
GROUP BY u.id, u.name, u.email, d.name
ORDER BY u.id;

-- Horas por mes y usuario, descontando pausas registradas.
SELECT
    DATE_FORMAT(f.clock_in, '%Y-%m') AS mes,
    u.name,
    d.name AS department,
    ROUND(SUM(
        TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out)
        - IFNULL((
            SELECT SUM(TIMESTAMPDIFF(MINUTE, fb.started_at, fb.ended_at))
            FROM fichaje_breaks fb
            WHERE fb.fichaje_id = f.id
        ), 0)
    ) / 60, 2) AS horas_netas
FROM fichajes f
INNER JOIN users u ON u.id = f.user_id
INNER JOIN departments d ON d.id = u.department_id
WHERE f.clock_out IS NOT NULL
GROUP BY DATE_FORMAT(f.clock_in, '%Y-%m'), u.id, u.name, d.name
ORDER BY mes, department, u.name;

-- Overtime aproximado por mes y usuario. Esperado: Tech/RRHH normal 8h netas, RRHH viernes 5h, Ventas 5.5h/5h sabado, Backend verano 7h.
SELECT
    t.mes,
    t.name,
    t.department,
    ROUND(SUM(GREATEST(t.net_minutes - t.expected_minutes, 0)) / 60, 2) AS horas_extra_aprox,
    ROUND(SUM(t.net_minutes) / 60, 2) AS horas_netas
FROM (
    SELECT
        DATE_FORMAT(f.clock_in, '%Y-%m') AS mes,
        u.name,
        d.name AS department,
        TIMESTAMPDIFF(MINUTE, f.clock_in, f.clock_out)
        - IFNULL((
            SELECT SUM(TIMESTAMPDIFF(MINUTE, fb.started_at, fb.ended_at))
            FROM fichaje_breaks fb
            WHERE fb.fichaje_id = f.id
        ), 0) AS net_minutes,
        CASE
            WHEN DATE(f.clock_in) = '2026-05-20' AND u.group_id = 2 THEN 360
            WHEN u.department_id = 1 AND u.group_id = 1 AND DATE(f.clock_in) BETWEEN '2026-07-01' AND '2026-08-31' THEN 420
            WHEN u.department_id = 2 AND DAYOFWEEK(f.clock_in) = 7 THEN 300
            WHEN u.department_id = 2 THEN 330
            WHEN u.department_id = 3 AND DAYOFWEEK(f.clock_in) = 6 THEN 300
            ELSE 480
        END AS expected_minutes
    FROM fichajes f
    INNER JOIN users u ON u.id = f.user_id
    INNER JOIN departments d ON d.id = u.department_id
    WHERE f.clock_out IS NOT NULL
) t
GROUP BY t.mes, t.name, t.department
ORDER BY t.mes, horas_extra_aprox DESC;

-- Retrasos claros.
SELECT
    u.name,
    d.name AS department,
    f.clock_in,
    TIMESTAMPDIFF(MINUTE, CONCAT(DATE(f.clock_in), ' 09:00:00'), f.clock_in) AS minutos_tarde
FROM fichajes f
INNER JOIN users u ON u.id = f.user_id
INNER JOIN departments d ON d.id = u.department_id
WHERE TIME(f.clock_in) > '09:15:00'
ORDER BY f.clock_in, u.name;

-- Fichajes abiertos.
SELECT
    f.id,
    u.name,
    f.clock_in,
    f.clock_out
FROM fichajes f
INNER JOIN users u ON u.id = f.user_id
WHERE f.clock_out IS NULL
ORDER BY f.clock_in;
