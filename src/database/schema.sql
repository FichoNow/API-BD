CREATE DATABASE IF NOT EXISTS BD_Jan_Fran;
USE BD_Jan_Fran;

/* ============= Borrado de tablas (al principio, no al final) =============*/
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
    primary_user_id INT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_groups_company_name (company_id, name),
    CONSTRAINT fk_groups_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
);

/* ============= Tabla users =============*/
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    group_id INT,
    email VARCHAR(254) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role ENUM('USER','ADMINISTRATOR') NOT NULL,
    password_hash VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_users_company
        FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_users_group
        FOREIGN KEY (group_id) REFERENCES work_groups(id)
);

/* ============= Tabla refresh_tokens =============*/
CREATE TABLE refresh_tokens (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    UNIQUE KEY uq_refresh_tokens_token_hash (token_hash),
    KEY idx_refresh_tokens_user_id (user_id)
);

/* ============= Tabla projects =============*/
CREATE TABLE projects (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_projects_company_name (company_id, name),
    CONSTRAINT fk_projects_company
        FOREIGN KEY (company_id) REFERENCES companies(id)
);

/* ============= Tabla fichajes =============*/
CREATE TABLE fichajes (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    clock_in DATETIME NOT NULL,
    clock_out DATETIME NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_fichajes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
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
);

/* ============= Inserts de prueba =============*/
INSERT INTO companies (
    name, cif_nif, email, address_line, city, postal_code
) VALUES (
    'Empresa Demo', 'B12345678', 'contacto@empresa.com',
    'Calle Principal 123', 'Barcelona', '08001'
);

INSERT INTO work_groups (name, company_id) VALUES
('Dirección', 1),
('Operaciones', 1);

INSERT INTO users (company_id, group_id, email, name, role, password_hash, is_active)
VALUES
-- Usuario base de pruebas        (contraseña: 1)
(1, 1, 'a@a.com', 'Test User', 'ADMINISTRATOR', '$argon2id$v=19$m=65536,t=3,p=4$lwHkTFUHxERk1xMTMe+E/g$CLpJFWRY32Cbl7CB6W6DGK3RQA/MHKDmhGhrmcYMbN8', TRUE),

-- Usuarios normales
(1, 1, 'admin@empresa.com', 'Bruce Wayne', 'ADMINISTRATOR', '$argon2id$v=19$m=65536,t=3,p=4$jLlSe5qff/xYfJBNS7VQjQ$QZ+DQWdRb2Cic+XL4egs8iDLO41O3bD6HbMrG1sJWXI', TRUE),  -- contraseña: bat123
(1, 2, 'empleado1@empresa.com', 'Clark Kent', 'USER', '$argon2id$v=19$m=65536,t=3,p=4$ql52pJF3lKWsPmNYGuUHtA$52P8spHNtonUU1F6Aa9oRYeAnr0s4EOokGcCKxf6NPc', TRUE),       -- contraseña: super123
(1, 2, 'empleado2@empresa.com', 'Diana Prince', 'USER', '$argon2id$v=19$m=65536,t=3,p=4$pNgjMOQmz1TngKB8UqOvHw$uKkOsHNWuaYD+Z+6SOd0Jv4FEiy5q3JsYMcWesbN+1c', TRUE); -- contraseña: wonder123