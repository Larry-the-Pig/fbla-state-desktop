const express = require('express');
require('dotenv').config()
const app = express();
const bodyParser = require('body-parser');

app.use(express.static("./public"))
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'pug')

app.get('/', function(req, res) {
    res.render('login', {test: req.ip})
})

app.post('/login', function(req, res) {
    console.log(req.header);
    res.send('recieved');
})

const userRouter = require('./routes/students');

app.use('/students', userRouter);

const eventRouter = require('./routes/events');

app.use('/events', eventRouter);

app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
  })