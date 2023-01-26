const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('login');
})
router.post('/', async function(req, res) {
    console.log(await login.login(req.body.user, req.body.pass))
    res.send(req.body)
})

router.get('/new', function(req, res) {
    res.render('studentSubmit');
})
router.post('/new', async function(req, res) {
    console.log(req.body)
    //if()
    const data = {
        firstName: req.body.firstName ?? null,
        lastName: req.body.lastName ?? null,
        email: req.body.email ?? null,
        gpa: parseFloat(req.body.gpa) ?? null,
        points: parseInt(req.body.points) ?? null,
    }
    const id = await login.createAccount(data.email, data.pass);

    res.redirect(`${id}/`);
    console.log(`Created ID: ${id}`);
})

module.exports = router;