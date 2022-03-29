const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
  user: 'root',
  database: 'employees',
  host: 'localhost'
});

db.connect( (err) => {
    if(err) throw err;
    init();
})

// const selectManager = (employee_id) => {
//   db.query(`
//     SELECT 
//     id AS value, 
//     CONCAT(first_name, ' ', last_name) AS name 
//     FROM employee 
//     WHERE NOT id = ?
//     `, employee_id, (err, managers) => {
//     inquirer.prompt({
//       type: 'rawlist',
//       message: 'Who\'s the manager?',
//       name: 'manager',
//       choices: managers
//     }).then((answers) => {
//       db.query(
//         'UPDATE employee SET manager_id = ? WHERE id = ?', 
//         [answers.manager, employee_id], 
//         (err, result) => {
//           console.log(result);
//           db.query('SELECT * FROM employee', (err, employees) => {
//             console.log(employees);
//           });
//         })
//     })
//   });
// };

// function addEmployee(){
//   inquirer.prompt(
//     [
//       {
//         message: 'What\'s the employee\'s first name?',
//         name: 'first_name'
//       },
//       {
//         message: 'What\'s the employee\'s last name?',
//         name: 'last_name'
//       }
//     ]
//   ).then((answers) => {
//     db.query(
//       'INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)', 
//       [answers.first_name, answers.last_name, 1], 
//       (err, result) => {
//         selectManager(result.insertId);
//       }
//     );
//   });
// };

const viewDepartments = () => {
    db.query('SELECT * FROM department', (err, result) => {
        if(err) throw err;
        console.table(result);
        init();
    })
}

const init = () => {
    inquirer.prompt(
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: ['VIEW ALL DEPARTMENTS', 'VIEW ALL ROWS', 'VIEW ALL EMPLOYEES', 'DONE']
        }
    ).then((answer) => {
        switch (answer.choice) {
            case 'VIEW ALL DEPARTMENTS':
              viewDepartments();
              break;
            case 'VIEW ALL ROWS':
            case 'VIEW ALL EMPLOYEES':
              console.log('Mangoes and papayas are $2.79 a pound.');
              // expected output: "Mangoes and papayas are $2.79 a pound."
              break;
            default:
              console.log(`GOODBYE`);
          }
    })
};

// init();