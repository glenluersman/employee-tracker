USE employee_tracker;

INSERT INTO department (name)
VALUES 
    ('Sales'),
    ('IT'),
    ('Finance'),
    ('Operations');


INSERT INTO role (title, salary, department_id)
VALUES
    ('Acountant', 100000, 3),
    ('Sales Lead', 90000, 1),
    ('Full Stack Developer', 80000, 2),
    ('Software Engineer', 120000, 2),
    ('Project Mananger', 100000, 4),
    ('Operations Manager', 90000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Steve', 'Smith', 1, null),
    ('Gina', 'Franko', 4, null),
    ('Jacob', 'Eckert', 2, null),
    ('Isaac', 'Newton', 6, 4),
    ('Robert', 'Allison', 5, 5);