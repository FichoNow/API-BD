create database if not exists BD_Jan_Fran;
use BD_Jan_Fran;

CREATE TABLE users (
    id INT AUTO_INCREMENT,
    company_id INT,
    group_id INT,
    email VARCHAR(254) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role ENUM('USER','ADMINISTRATOR'),
    job_title VARCHAR(100),
    password_hash VARCHAR(255),
    is_active TINYINT(1),
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_at TIMESTAMP,
    PRIMARY KEY (id)
);

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
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_companies_name (name),
    UNIQUE KEY uq_companies_vat_number (vat_number)
);

/*He tenido que poner el nombre de la tabla con "work_" porque groups es sintaxis sql...*/
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

/* ============== Enlaces entre tablas ==============*/
ALTER TABLE users
ADD CONSTRAINT fk_users_company
FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE users
ADD CONSTRAINT fk_users_group
FOREIGN KEY (group_id) REFERENCES work_groups(id);


/* ============= Borrado de las tablas (por si acaso) =============*/
drop table if exists users;
drop table if exists work_groups;

/*Inserts de prueba*/
INSERT INTO users (company_id, group_id, email, name, role, job_title, password_hash, is_active)
VALUES
(1, 1, 'admin@empresa.com', 'Bruce Wayne', 'ADMINISTRATOR', 'Director', 'bat123', 1),
(1, 2, 'empleado1@empresa.com', 'Clark Kent', 'USER', 'Analista', 'super123', 1),
(1, 2, 'empleado2@empresa.com', 'Diana Prince', 'USER', 'Recursos Humanos', 'wonder123', 1);

