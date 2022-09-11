const express = require('express');
const app = express();
const fs = require('fs');

app.get('/', function(req, res) {
    res.send("<form action='login' method='post'><input type='text' name='user' placeholder='Username' /><input type='text' name='pass' placeholder='Password' /><input type='submit' /></form>");
})

app.post('/login', function(req, res) {
    console.log(req.header);
    res.send('recieved');
})

app.listen(8080);