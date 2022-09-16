const express = require('express');
const router = express.Router();
const { getStudent, createStudent, deleteStudent } = require('../src/database');

//const client = require('../src/database')
//app.use(bodyParser.json());


router.get('/', function(req, res) {
    res.send('students')
})

router.post('/new', async function(req, res) {
    const id = await createStudent(req.body);

    //const id = await studentRepository.save(student)
    res.redirect(id);
    console.log(req.body)
})

router.route('/:id')
    .get(async function(req, res) {
        const data = await getStudent(req.params.id);
        console.log(data)
        res.render('student', data)
    })
    .put(function(req, res) {
        res.send(req.params.id.toString())
    })
    .delete(function(req, res) {
        deleteStudent(req.params.id);
        res.redirect('/')
    })

router.param('id', function(req, res, next, id) {
    console.log(id);
    next();
})


module.exports = router;