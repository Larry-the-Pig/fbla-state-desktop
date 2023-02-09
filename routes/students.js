const express = require('express');
const router = express.Router();
const {Student} = require('../src/database');
const { login } = require('../src/login');

router.get('/', async function(req, res) {
    let data = {};
    
    if (req.session.loggedin) {
        data.loggedin = true;
        data.username = req.session.username
        data.entityId = req.session.entityId
    }
    if (req.query.q === undefined || req.query.q === '') {
        //Empty Search Results
        data.results = [];
        res.render('searchStudent', data)
    } else {
        //Search db for query
        const results = await Student.search(req.query.q)
        data.results = results
        res.render('searchStudent', data)
    }
})

router.get('/leaderboard', async function(req, res) {
    let data = {};
    
    if (req.session.loggedin) {
        data.loggedin = true;
        data.username = req.session.username
data.entityId = req.session.entityId
    }
    
    data.results = await Student.leaderboard();
    res.render('leaderboard', data)
})

router.get('/report', async function(req, res) {
    const data = await Student.getReport();

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            if (data[key].points > 10) {
                data[key]["prize"] = "lunch with the School Mascot";
            } else if (data[key].points > 5) {
                data[key]["prize"] = "a free EHS T-Shirt";
            } else {
                data[key]["prize"] = "a free cookie from the Snack Shack";
            }
        }
    }

    res.render('report', data);
})

router.get('/submit', async function(req, res) {
    let data = {};
    
    if (req.session.loggedin) {
        data.loggedin = true;
        data.username = req.session.username
data.entityId = req.session.entityId
    }
    res.render('submitStudent', data)
})

router.post('/:id/edit', async function(req, res) {
    if(req.session.entityId !== req.params.id || req.session.isAdmin) {
        res.status(401);
        res.send("Error 401: Not Authorized");
        return
    }
    const data = {
        firstName: req.body.firstName ?? null,
        lastName: req.body.lastName ?? null,
        email: req.body.email ?? null,
        gpa: parseFloat(req.body.gpa) ?? null,
        gradeLevel: parseInt(req.body.gradeLevel) ?? null,
    }

    await Student.edit(req.params.id, data);
    res.redirect(`/students/${req.params.id}/`)
})

router.route('/:id/')
    .get(async function(req, res) {
        let data = {};
        if (req.session.loggedin) {
            data.loggedin = true;
            data.username = req.session.username
            data.entityId = req.session.entityId
        }

        data.editAccess = false;
        if (req.session.entityId === req.params.id || req.session.isAdmin) {
            data.editAccess = true;
        }
        
        data.results = await Student.get(req.params.id);

        res.render('student', data)
    })
    .delete(async function(req, res) {
        await Student.delete(req.params.id);
        req.session.destroy();
        res.redirect('/')
    })

router.get('/report')

router.param('id', function(req, res, next, id) {
    if (req.session.loggedin) {
        
    }
    next();
})

module.exports = router;