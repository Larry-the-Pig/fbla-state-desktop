const express = require('express');
const router = express.Router();
const login = require('../src/login')
const { Student } = require('../src/database')
const { createHash } = require('crypto')

router.get('/', function(req, res) {
    res.render('login');
})
router.post('/', async function(req, res) {
    let username = req.body.user;
    let password = req.body.pass;

    if(!(username && password)) {
        res.status(400)
        res.send("Please enter a username and password.");
        return;
    }

    const hash = createHash('sha256').update(password).digest('hex');
    const student = await Student.searchEmail(username);

    if (student == null) {
        res.send("Account does not exist.");
        return
    }



    if (student.password === hash) {
        req.session.loggedin = true;
        req.session.username = username
        req.session.entityId = student.entityId
        req.session.isAdmin = student.isAdmin;
        res.redirect('/');
        return;
    }
    else {
        res.send("Incorrect Username or Password.");
    }
})

router.post('/logout', async function(req, res) {
    req.session.destroy(function(err) {
        console.log(err);
        res.status(500);
        res.send(err);
        return
      })

      res.redirect("/");
})

router.get('/new', function(req, res) {
    res.render('submitStudent');
})
router.post('/new', async function(req, res) {
    if(req.body.firstName === undefined || req.body.lastName === undefined || req.body.email===undefined || req.body.gpa===undefined) {
        res.status(400);
        res.send('400 Bad Request');
        return
    }

    //https://stackoverflow.com/questions/52740718/test-if-a-string-is-a-valid-float-in-javascript
    if (!/^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(req.body.gpa)) {
        res.status(400);
        res.send('400 Bad Request');
        return
    }

    //https://stackoverflow.com/questions/52740718/test-if-a-string-is-a-valid-float-in-javascript
    if (!/^\d+$/.test(req.body.gradeLevel)) {
        res.status(400);
        res.send('400 Bad Request');
        return
    }
    
    const gpa = parseFloat(req.body.gpa);
    const gradeLevel = parseInt(req.body.gradeLevel);
    const id = await login.createAccount(req.body.email, req.body.password, req.body.firstName, req.body.lastName, gradeLevel, gpa);

    if (id.startsWith("Error")) {
        res.status(400)
        res.send(id);
        return
    }

    res.redirect(`/students/${id}/`);
})

module.exports = router;