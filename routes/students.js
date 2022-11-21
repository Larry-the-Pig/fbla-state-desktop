const express = require('express');
const router = express.Router();
const {Student} = require('../src/database');

router.get('/', async function(req, res) {
    if (req.query.q === undefined || req.query.q === '') {
        //Empty Search Results
        res.render('searchStudent', { results: [] })
    } else {
        //Search db for query
        const results = await Student.search(req.query.q)
        res.render('searchStudent', { results: results })
    }
})

router.get('/leaderboard', async function(req, res) {
    const results = await Student.leaderboard();
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
    const id = await Student.create(data);

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

    await Student.edit(req.params.id, data);
    res.redirect(`/students/${req.params.id}/`)
})

router.route('/:id/')
    .get(async function(req, res) {
        const data = await Student.get(req.params.id);

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
        await Student.delete(req.params.id);
        res.redirect('/')
    })

router.param('id', function(req, res, next, id) {
    //req.params.id
    next();
})

module.exports = router;