INSERT INTO departments (departments_name)
VALUES ('Sales'),
       ('Engineering'),
       ('Legal'),
       ('Finance');

INSERT INTO role (title, salary, departments_id)
VALUES ('Sale Lead', 150000, 1),
       ('Salesperson', 100000, 1),
       ('Lead Engineer', 135000, 2),
       ('Software Engineer', 100000, 2),
       ('Account Manager', 200000, 3),
       ('Accountant', 175000, 3),
       ('Legal Team Lead', 250000, 4),
       ('Lawyer', 300000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, null),
       ('Mike', 'Chan', 1, 1),
       ('Ashley', 'Rodriguez', 2, null),
       ('Kevin', 'Tupik', 2, 2 ),
       ('Kunal', 'Singh', 3, null),
       ('Malia', 'Brown', 3, 3),
       ('Sarah', 'Lourd', 4, null),
       ('Tom', 'Allen', 4, 4);

