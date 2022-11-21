const express = require('express');
const router = express.Router();
const { Event } = require('../src/database');

router.get('/', async function(req, res) {
    if (req.query.q === undefined || req.query.q === '') {
        //Empty Search Results
        res.render('searchEvent', { results: [] })
    } else {
        //Search db for query
        console.log("results")
        const results = await Event.search(req.query.q)
        res.render('searchEvent', { results: results })
    }
})

router.get('/calendar', async function(req, res) {
    const results = await database.getLeaderboard();
    //console.log(results)
    res.render('calendar', { results: results })
})

router.get('/submit', async function(req, res) {
    res.render('submitEvent')
})

router.post('/new', async function(req, res) {
    const date = new Date(req.body.date);
    const data = {
        title: req.body.title ?? null,
        description: req.body.description ?? null,
        date: (isNaN(date.getTime())) ? null : date,
    }
    console.log(data)
    const id = await Event.create(data);

    res.redirect(`${id}/`);
    console.log(`Created ID: ${id}`);
})

router.post('/:id/edit', async function(req, res) {
    console.log(req.body);
    const date = new Date(req.body.date);
    const data = {
	    title: req.body.title ?? null,
	    description: req.body.description ?? null,
	    date: (isNaN(date.getTime())) ? null : date
    };

    console.log(data);

    await database.editStudent(req.params.id, data);
    res.redirect(`/students/${req.params.id}/`)
})

router.route('/:id/')
    .get(async function(req, res) {
        const data = await Event.get(req.params.id);

        data.date = (data.date === null) ? null : data.date.toDateString();

        res.render('event', data)
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
