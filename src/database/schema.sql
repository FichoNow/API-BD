CREATE DATABASE IF NOT EXISTS BD_Jan_Fran;
USE BD_Jan_Fran;

/* ============= Borrado de tablas (al principio, no al final) =============*/
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS work_groups;
DROP TABLE IF EXISTS companies;

/* ============= Tabla companies =============*/
CREATE TABLE companies (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    vat_number VARCHAR(50) NOT NULL,
    email VARCHAR(254) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address_line1 VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_companies_name (name),
    UNIQUE KEY uq_companies_vat_number (vat_number)
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
    company_id INT,
    group_id INT,
    email VARCHAR(254) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role ENUM('USER','ADMINISTRATOR') NOT NULL,
    job_title VARCHAR(100),
    password_hash VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_users_company
        FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_users_group
        FOREIGN KEY (group_id) REFERENCES work_groups(id)
);



/* ============= Inserts de prueba =============*/
INSERT INTO companies (
    name, vat_number, email, phone, address_line1, city, region, postal_code, country_code
) VALUES (
    'Empresa Demo', 'B12345678', 'contacto@empresa.com', '600123123',
    'Calle Principal 123', 'Barcelona', 'Cataluña', '08001', 'ES'
);

INSERT INTO work_groups (name, company_id) VALUES
('Dirección', 1),
('Operaciones', 1);

INSERT INTO users (company_id, group_id, email, name, role, job_title, password_hash, is_active)
VALUES
-- Usuario base de pruebas
(1, 1, 'a@1', 'Test User', 'ADMINISTRATOR', 'Testing', '1', 1),

-- Usuarios normales
(1, 1, 'admin@empresa.com', 'Bruce Wayne', 'ADMINISTRATOR', 'Director', 'bat123', 1),
(1, 2, 'empleado1@empresa.com', 'Clark Kent', 'USER', 'Analista', 'super123', 1),
(1, 2, 'empleado2@empresa.com', 'Diana Prince', 'USER', 'Recursos Humanos', 'wonder123', 1);