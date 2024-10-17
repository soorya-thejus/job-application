const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyparser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password:'pass@word1',
    database:'admin'
});

db.connect((err) =>{
    if(err){
        console.error('Error:' + err.stack);
        return;
    }
    console.log('Connected to mysql:' + db.threadId);
});

app.get('/api/jobs', (req, res) => {
    db.query('SELECT * FROM jobs', (err, results) =>{
        if(err) {
            console.log('Error while getting jobs: ' + err.stack);
            res.status(500).send('Error in get!');
            return;
        }
        res.json(results);
    });
});

app.post('/api/jobs', (req, res) => {
    const{jobName, jobLoc} =req.body;
    db.query('INSERT INTO jobs (jobName, jobLoc) VALUES (?, ?)',[jobName, jobLoc], (err, result) =>{
        if(err) {
            console.error('Error executing query: '+ err.stack);
            res.status(400).send('Error creating jobs');
            return;
        }

        res.status(201).send('job posted successfully');
    });
});


app.listen(PORT ,() => {
    console.log(`Server is running on port ${PORT}`);
});