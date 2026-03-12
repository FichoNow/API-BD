CREATE TABLE users (
    id INT AUTO_INCREMENT,
    company_id INT,
    groups_id INT,
    email VARCHAR(254),
    name VARCHAR(100),
    role ENUM('USER','ADMINISTRATOR'),
    puesto VARCHAR(100),
    password_hash VARCHAR(255),
    is_active TINYINT(1),
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP,
    created_at TIMESTAMP,
    PRIMARY KEY (id)
);