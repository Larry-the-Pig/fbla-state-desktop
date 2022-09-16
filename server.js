const express = require('express');
require('dotenv').config()
const app = express();
const bodyParser = require('body-parser');

app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

const eventRouter = require('./routes/events');

app.use('/events', eventRouter);

console.log(process.env.PORT)

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
  })