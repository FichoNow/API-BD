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

drop table if exists users;

/*Inserts de prueba*/
INSERT INTO users (company_id, group_id, email, name, role, job_title, password_hash, is_active)
VALUES
(1, 1, 'admin@empresa.com', 'Bruce Wayne', 'ADMINISTRATOR', 'Director', 'bat123', 1),
(1, 2, 'empleado1@empresa.com', 'Clark Kent', 'USER', 'Analista', 'super123', 1),
(1, 2, 'empleado2@empresa.com', 'Diana Prince', 'USER', 'Recursos Humanos', 'wonder123', 1);