const express = require('express');
const router = express.Router();
const { Event, Student } = require('../src/database');

router.get('/', async function(req, res) {
    let data = {};
    
    if (req.session.loggedin) {
        data.loggedin = true;
        data.username = req.session.username
        data.entityId = req.session.entityId
        data.isAdmin = req.session.isAdmin;
    }

    if (req.query.q === undefined || req.query.q === '') {
        //Empty Search Results
        data.results = [];
    } else {
        //Search db for query
        data.results = await Event.search(req.query.q)
    }
    res.render('searchEvent', data)
})

router.get('/calendar', async function(req, res) {
    let data = {};

    if (req.session.loggedin) {
        data.loggedin = true;
        data.username = req.session.username
        data.entityId = req.session.entityId
        data.isAdmin = req.session.isAdmin;
    }

    data.results = await Event.calendar();
    res.render('calendar', data)
})

router.get('/submit', async function(req, res) {
    if(!req.session.isAdmin) {
        res.status(400);
        res.send('400: Not Authorized');
        return;
    }
    
    let data = {};

    if (req.session.loggedin) {
        data.loggedin = true;
        data.username = req.session.username
        data.entityId = req.session.entityId
        data.isAdmin = req.session.isAdmin;
    }
    res.render('submitEvent', data)
})

router.post('/new', async function(req, res) {
    if (!req.session.isAdmin) {
        res.status(400);
        res.send('400: Not Authorized');
        return;
    }
    const date = new Date(req.body.date);
    const data = {
        title: req.body.title ?? null,
        description: req.body.description ?? null,
        date: (isNaN(date.getTime())) ? null : date,
    }

    const id = await Event.create(data);

    res.redirect(`${id}/`);
})

router.post('/:id/edit', async function(req, res) {
    const date = new Date(req.body.date);
    const data = {
	    title: req.body.title ?? null,
	    description: req.body.description ?? null,
	    date: (isNaN(date.getTime())) ? null : date
    };

    await database.editStudent(req.params.id, data);
    res.redirect(`/students/${req.params.id}/`)
})

router.post('/:id/attended', async function(req, res) {
    const studentId = req.session.entityId;
    const eventId = req.params.id;
    
    await Student.addEventAttended(eventId, studentId);
    res.redirect(`/events/${req.params.id}/`)
})

router.route('/:id/')
    .get(async function(req, res) {
        let data = {};
        
        data.result = await Event.get(req.params.id);
        
        data.result.date = (data.result.date === null) ? null : data.result.date.toLocaleString();
        
        data.attended = true;
        if (req.session.loggedin) {
            data.loggedin = true;
            data.username = req.session.username
            data.entityId = req.session.entityId
            
            const student = await Student.get(req.session.entityId);
            data.attended = false;
            if (student.eventsAttended.includes(req.params.id)) {
                data.attended = true;
            }
        }

        res.render('event', data)
    })
    .delete(async function(req, res) {
        await database.deleteStudent(req.params.id);
        res.redirect('/')
    })

router.param('id', function(req, res, next, id) {
    //req.params.id
    next();
})

module.exports = router;
