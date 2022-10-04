const express = require('express');
const router = express.Router();
const database = require('../src/database');

router.get('/', async function(req, res) {
    if (req.query.q === undefined || req.query.q === '') {
        //Empty Search Results
        res.render('search', { results: [] })
    } else {
        //Search db for query
        const results = await database.searchStudent(req.query.q)
        res.render('search', { results: results })
    }
})

router.get('/leaderboard', async function(req, res) {
    const results = await database.getLeaderboard();
    //console.log(results)
    res.render('leaderboard', { results: results })
})

router.get('/submit', async function(req, res) {
    res.render('submitStudent')
})

router.post('/new', async function(req, res) {
    console.log(req.body)
    const data = {
        firstName: req.body.firstName ?? null,
        lastName: req.body.lastName ?? null,
        email: req.body.email ?? null,
        gpa: parseFloat(req.body.gpa) ?? null,
        points: parseInt(req.body.points) ?? null,
    }
    const id = await database.createStudent(data);

    res.redirect(`${id}/`);
    console.log(`Created ID: ${id}`);
})

router.post('/:id/edit', async function(req, res) {
    console.log(req.body);
    const data = {
        firstName: req.body.firstName ?? null,
        lastName: req.body.lastName ?? null,
        email: req.body.email ?? null,
        gpa: parseFloat(req.body.gpa) ?? null,
        points: parseInt(req.body.points) ?? null,
    }

    await database.editStudent(req.params.id, data);
    res.redirect(`/students/${req.params.id}/`)
})

router.route('/:id/')
    .get(async function(req, res) {
        const data = await database.getStudent(req.params.id);

        res.render('student', data)
    })
    .put(async function(req, res) {
        console.log(req.body);
        const data = {
            firstName: req.body.firstName ?? null,
            lastName: req.body.lastName ?? null,
            email: req.body.email ?? null,
            gpa: parseInt(req.body.gpa) ?? null,
            points: parseInt(req.body.points) ?? null,
        }

        //await database.editStudent(req.params.id, data);
        res.send('ok')
    })
    .delete(async function(req, res) {
        console.log('Deleted: ' + req.params.id)
        await database.deleteStudent(req.params.id);
        res.redirect('/')
    })

router.param('id', function(req, res, next, id) {
    //req.params.id
    next();
})

module.exports = router;