const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config()

app.use(express.static("./public"))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(cors());
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