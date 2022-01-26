const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const util = require('util');

require('dotenv').config()

let connection = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'employee_tracker'
    },
);

const query = util.promisify(connection.query).bind(connection);
console.log('Connected to the database employee_tracker');

const connected = () => {
    console.log('********************************')
    console.log('*                              *')
    console.log('*          Employee            *')
    console.log('*          Manager             *')
    console.log('*                              *')
    console.log('********************************')
    promptUser();
};

const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: ['View All Departments',
            'View All Roles',
            'View All Employees',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee Role',
            'Quit']
        }
    ])
    .then((answers) => {
        const { choices } = answers;

        if (choices === 'View All Departments') {
            showDepartments();
        }
        
        if (choices === 'View All Roles') {
            showRoles();
        }
        
        if (choices === 'View A Employees') {
            showEmployees();
        }
        
        if (choices === 'Add Department') {
            addDepartment();
        }
        
        if (choices === 'Add Role') {
            addRole();
        }
        
        if (choices === 'Add Employee') {
            addEmployee();
        }
        
        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }

        if (choices === 'Quit') {
            connection.end();
        };
    });
};

showDepartments = async () => {
    console.log('*****Showing All Departments*****');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    const rows = await query(sql)
    console.table(rows);
    promptUser();
};

// showRoles = () => {
//     console.log('*****Showing All Roles*****');
//     const sql = `SELECT role.id, role.role_title, department.department_name, role`
// }
connected()