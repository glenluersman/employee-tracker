DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
    id INTEGER PRIMARY KEY
    department_name VARCHAR(30)
);

CREATE TABLE role (
    id INTEGER PRIMARY KEY
    role_title VARCHAR(30)
    role_salary DECIMAL
    CONSTRAINT fk_department FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY
    first_name VARCHAR(30)
    last_name VARCHAR(30)
    CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES role(id)
    CONSTRAINT fk_employee FOREIGN KEY(employee_id) REFERENCES employee(id)
);