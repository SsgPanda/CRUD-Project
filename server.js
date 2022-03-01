// Add Express server to the project.
const express = require('express');
const app = express();

// for JSON object in request
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Connection details
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'EmployeeData',
    multipleStatements: true 
});

// Connecting to mysql database
connection.connect( err => {
    if(!err) console.log("Database Connection Successful");
    else console.log("Database Connection Failed: "+JSON.stringify(err));
});

// Get all employees
app.get('/', (req, res) => {
    let query = 'SELECT * FROM Employee;';
    connection.query(query, (err, rows, fields) => {
        if(!err) res.send(rows);
        else res.send(err);
    });
});

// Get employee with id
app.get('/get/:id', (req, res) => {
    let query = 'SELECT * FROM Employee WHERE id = ?;';
    connection.query(query, [req.params.id], (err, rows, fields) => {
        if(!err) res.send(rows);
        else res.send(err);
    });
});

// Delete an employee
app.delete('/delete/:id', (req, res) => {
    let query = 'DELETE FROM Employee WHERE id = ?;';
    connection.query(query, [req.params.id], (err, rows, fields) => {
        if(!err) {
            console.log("Deleted Employee..: ");
            res.redirect('/');
        }
        else {res.send(err);}
    });
});

// Insert an employee
app.post('/post', (req, res) => {
    let body = req.body;
    if (validate(body)){
        let query = 'INSERT INTO Employee (id, name, job, department, salary, hiredate) VALUES ?;';
        let values = [ [body.id, body.name, body.job, body.department, body.salary, body.hiredate] ];
        connection.query(query, [values], (err, rows, fields) => {
            if(!err) {
                console.log("Inserted Employee..: ");
                res.redirect('/');
            }
            else {res.send(err);}
        });
    }
    else res.status(400).send("Bad Request");
});

// Update an employee
app.put('/put', (req, res) => {
    let body = req.body;
    if (validate(body)){
        let query = 'UPDATE Employee SET name=?, job=?, department=?, salary=?, hiredate=? WHERE id=?;';
        let values = [body.name, body.job, body.department, body.salary, body.hiredate, body.id];

        connection.query(query, values, (err, rows, fields) => {
            if(!err) {
                console.log("Updated Employee..");
                res.redirect('/');
            }
            else {res.send(err);}
        });
    }
    else res.status(400).send("Bad Request");
});

// for Validation of insertion data
function validate(b){
    if (Object.keys(b).length == 6){
        for (let i in b){
            if (i == undefined) return false;
        }

        if (b.salary < 0) return false;

        return true;
    }
    return false;
}

app.listen(3000, () => {console.log("Server listening on port: 3000")});