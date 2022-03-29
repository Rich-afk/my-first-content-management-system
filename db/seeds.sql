USE employees;

INSERT INTO department (name)
VALUES ("Web Development"),
       ("Data Science"),
       ("Math"),
       ("Electives");

INSERT INTO role (title, salary, department_id)
VALUES ("clown", 34.5, 1),
       ("producer", 5, 3),
       ("asdf", 50000, 2),
       ("jkl;", 12, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rich", "Kim", 1, NULL),
       ("Juan", "Delgado", 2, 1);