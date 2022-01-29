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
            choices: ['View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'Quit']
        }
    ])
    .then((answers) => {
        const { choices } = answers;
        
        if (choices === 'View All Employees') {
            showEmployees();
        }

        if (choices === 'Add Employee') {
            addEmployee();
        }

        if (choices === 'Update Employee Role') {
            updateEmployeeRole();
        }
        
        if (choices === 'View All Roles') {
            showRoles();
        }
        
        if (choices === 'Add Role') {
            addRole();
        }

        if (choices === 'View All Departments') {
            showDepartments();
        }
        
        if (choices === 'Add Department') {
            addDepartment();
        }
        
        if (choices === 'Quit') {
            connection.end();
        };
    });
};

showEmployees = async () => {
    console.log('*****Showing All Employees*****');

    const sql = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name AS department, 
                role.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    const rows = await query(sql)
    console.table(rows);
    promptUser();
};

addEmployee = async () => {
    console.log('*****Add An Employee*****');

    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }        
    ])
    .then( async (answers) => {
        const params = [answers.first_name, answers.last_name];

        const roleSql = `SELECT title, id FROM role`;

        const data = await query(roleSql)   

            const roles = data.map(({ title, id }) => ({ name: title, value: id }));
    
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles,
                }
            ])
            .then( async (roleChoice) => {
                const role = roleChoice.role;
                params.push(role);
    
                const managerSql = `SELECT manager_id, first_name, last_name FROM employee`;
    
                const data = await query(managerSql)
    
                const managers = data.map(({ manager_id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: manager_id }));
    
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                    }
                ])
                .then( async (managerChoice) => {
                    const manager = managerChoice.manager;
                    params.push(manager);
    
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, ?)`;
    
                    await query(sql, params)
                    console.log('Employee has been added!');
    
                    showEmployees()
                });
            });
    });
};

updateEmployeeRole = async () => {
    console.log('*****Update Employee Role*****');

    const employeeSql = `SELECT * FROM employee`;

    const data = await query(employeeSql)

    const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id}));

    inquirer.prompt ([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's role do you want to update?",
            choices: employees
        }
    ])
    .then( async (employeeChoice) => {
        params = [];

        params.push(employeeChoice.employee);

        const roleSql = `SELECT id, title FROM role`;

        const data = await query(roleSql)

        const roles = data.map(({ title, id }) => ({ name: title, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role do you want to assign the selected employee?',
                choices: roles
            }
        ])
        .then( async (roleChoice) => {
            params.push(roleChoice.role);
            
            const reversedParams = params.reverse();

            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

            await query(sql, params)

            showEmployees()
        });
    });
};

showRoles = async () => {
    console.log('*****Showing All Roles*****');

    const sql = `SELECT role.id, role.title, role.salary, department.name AS department 
                FROM role
                INNER JOIN department on role.department_id = department.id`;

    const rows = await query(sql);
    console.table(rows);
    promptUser();
};

addRole = async () => {
    console.log('*****Add Role*****');

    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What role would you like to add?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a salary');
                    return false;
                }
            }
        }
    ])
    .then( async (answers) => {
        params = [answers.title, answers.salary];

       const roleSql = `SELECT name, id FROM department`;

       data = await query(roleSql)

       const dept = data.map(({ name, id }) => ({ name: name, value: id}));

       inquirer.prompt([
           {
               type: 'list',
               name: 'dept',
               message: 'Which department does this role belong to?',
               choices: dept
           }
       ])
       .then( async (deptChoice) => {
           const dept = deptChoice.dept;
           params.push(dept);

           const sql = `INSERT INTO role (title, salary, department_id)
           VALUES (?, ?, ?)`;

           await query(sql, params)
           console.log('Added ' + answers.title + ' to roles!');

           showRoles()
       });
    });
};

showDepartments = async () => {
    console.log('*****Showing All Departments*****');

    const sql = `SELECT department.id AS id, department.name AS department 
                FROM department`;

    const rows = await query(sql)
    console.table(rows);
    promptUser();
};

addDepartment = async () => {
    console.log('*****Add Department*****');

    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What is the name of the department?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a department');
                }
            }
        }
    ])
    .then( async (answer) => {
        const sql = `INSERT INTO department (name)
        VALUES (?)`;

        await query(sql, answer.addDept)

        console.log('Added ' + answer.addDept + ' to departments!');

        showDepartments()
    });
};


connected()