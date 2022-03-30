const inquirer = require('inquirer');
const mysql = require('mysql2');
// require('console.table');

const db = mysql.createConnection({
    user: 'root',
    database: 'employees',
    host: 'localhost'
});

db.connect((err) => {
    if (err) throw err;
    init();
})

//for employees

const viewEmployees = () => {
    db.query('SELECT * FROM employee', (err, result) => {
        if (err) throw err;
        console.table(result);
        init();
    })
}

const setEmployeeManager = (employeeId) => {
    db.query(`
    SELECT
    id AS value, 
    CONCAT(first_name, ' ', last_name) AS name 
    FROM employee 
    WHERE NOT id = ?
    `, employeeId, (err, managers) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'Who\'s the manager?',
            name: 'manager',
            choices: managers
        }).then((answers) => {
            db.query(
                'UPDATE employee SET manager_id = ? WHERE id = ?',
                [answers.manager, employeeId],
                (err, result) => {
                    //   console.log(result);
                    db.query('SELECT * FROM employee', (err, employees) => {
                        // console.log(employees);
                    });
                    init();
                })
        })
    });
};

function setEmployeeRole (employeeID) {
    db.query(`
    SELECT
    id AS value,
    title AS name
    FROM role
    `, (err, roles) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'Which role is your employee?',
            name: 'role',
            choices: roles
        }).then((answers) => {
            db.query(
                'UPDATE employee SET role_id = ? WHERE id = ?',
                [answers.role, employeeID],
                (err, result) => {
                    //   console.log(result);
                    db.query('SELECT * FROM employee', (err, employees) => {
                        // console.log(employees);
                        setEmployeeManager(employeeID);
                    });
                })
        })
    });
};

function addEmployee() {
    inquirer.prompt(
        [
            {
                message: 'What\'s the employee\'s first name?',
                name: 'first'
            },
            {
                message: 'What\'s the employee\'s last name?',
                name: 'last'
            }
        ]
    ).then((answers) => {
        const roleID = 0;
        db.query(
            'INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)',
            [answers.first, answers.last, 1],
            (err, result) => {
                // console.log(result.insertId);
                setEmployeeRole(result.insertId);
            }
        );
    }
    );
};


function getSwitchRole(employeeID) {
    db.query(`
        SELECT
        id AS value, 
        title AS name
        FROM role 
        `, (err, roles) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'Which role would you like to switch this employee to?',
            name: 'role',
            choices: roles
        }).then((answer) => {
            db.query(
                'UPDATE employee SET role_id = ? WHERE id = ?',
                [answer.role, employeeID],
                (err, result) => {
                    init();
                })
        })
    });
}

function updateEmployee() {
    db.query(`
    SELECT
    id AS value, 
    CONCAT(first_name, ' ', last_name) AS name 
    FROM employee 
    `, (err, employees) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'Which employee?',
            name: 'employee',
            choices: employees
        }).then((answer) => {
            // console.log(answer.employee);
            getSwitchRole(answer.employee);
        })
    });
}

//for departments

const viewDepartments = () => {
    db.query('SELECT * FROM department', (err, result) => {
        if (err) throw err;
        console.table(result);
        init();
    })
};

const addDepartment = () => {
    inquirer.prompt(
        [
            {
                message: 'What\'s the department\'s name?',
                name: 'name'
            }
        ]
    ).then((answers) => {
        db.query(
            'INSERT INTO department (name) VALUES (?)',
            [answers.name],
            (err, result) => {
                init();
            }
        );
    }
    );
}


//for roles

const viewRoles = () => {
    db.query('SELECT * FROM role', (err, result) => {
        if (err) throw err;
        console.table(result);
        init();
    })
}

const setDepartment = (departmentId) => {
    db.query(`
      SELECT 
      id AS value,
      name AS name
      FROM department
      `, (err, departments) => {
        inquirer.prompt({
            type: 'rawlist',
            message: 'What is the department?',
            name: 'department',
            choices: departments
        }).then((answers) => {
            db.query(
                'UPDATE role SET department_id = ? WHERE id = ?',
                [answers.department, departmentId],
                (err, result) => {
                    init();
                })
        })
    });
};

const addRole = () => {
    inquirer.prompt(
        [
            {
                message: 'What\'s the role\'s name?',
                name: 'title'
            },
            {
                message: 'What\'s the role\'s salary?',
                name: 'salary'
            }
        ]
    ).then((answers) => {
        db.query(
            'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)',
            [answers.title, answers.salary, 1],
            (err, result) => {
                // console.log(result.insertID);
                setDepartment(result.insertId);
            }
        );
    }
    );
}




const init = () => {
    inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit']
        }
    ).then((answer) => {
        switch (answer.choice) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Exit':
                console.log(`Goodbye`);
                process.exit(1);
            default:
                console.log(`Error`);
                process.exit(1);
        }
    })
};