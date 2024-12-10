DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    departments_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL NOT NULL,
    departments_id INTEGER NOT NULL,
    FOREIGN KEY (departments_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
