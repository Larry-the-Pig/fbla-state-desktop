const express = require('express');
const app = express();

app.use(express.static("./public"))

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('login', {test: req.ip})
})

app.post('/login', function(req, res) {
    console.log(req.header);
    res.send('recieved');
})

const userRouter = require('./routes/students');

app.use('/students', userRouter);

app.listen(8080);