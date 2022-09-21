const express = require('express');
const router = express.Router();
const database = require('../src/database');

//const client = require('../src/database')
//app.use(bodyParser.json());


router.get('/', async function(req, res) {
    if (req.query.q === undefined || req.query.q === '') {
        res.render('search', { results: [] })
        console.log('undefined')
    } else {
        console.log(req.query.q)
        const results = await database.searchStudent(req.query.q)
        //console.log(results)
        res.render('search', { results: results })
    }
})

router.get('/leaderboard', async function(req, res) {
    const results = await database.getLeaderboard();
    //console.log(results)
    res.render('leaderboard', { results: results })
})

router.post('/new', async function(req, res) {
    console.log(res.body)
    const id = await database.createStudent(req.body);

    //const id = await studentRepository.save(student)
    res.redirect(id);
    console.log(`Created ID: ${id}`);
})

router.route('/:id')
    .get(async function(req, res) {
        const data = await database.getStudent(req.params.id);
        //console.log(data)
        res.render('student', data)
    })
    .put(function(req, res) {
        res.send(req.params.id.toString())
    })
    .delete(function(req, res) {
        console.log('deleted ' + req.params.id)
        database.deleteStudent(req.params.id);
        res.redirect('/')
    })

router.param('id', function(req, res, next, id) {
    //console.log(id);
    next();
})


module.exports = router;