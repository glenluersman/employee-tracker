const inquire = require('inquirer');
const mysql = require('mysql2');

require('dotenv').config()

const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'employee_tracker'
    },
);

db.connect(err => {
    if (err) throw err;
    console.log('Connected to the database employee_tracker');
    connected();
})

const connected = () => {
    console.log('********************************')
    console.log('*                              *')
    console.log('*          Employee            *')
    console.log('*          Manager             *')
    console.log('*                              *')
    console.log('********************************')
    //promptUser();
};