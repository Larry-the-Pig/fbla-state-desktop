const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.send('students')
})

router.route('/:id')
    .get(function(req, res) {
        res.send(req.params.id)
    })
    .put(function(req, res) {
        res.send(req.params.id.toString())
    })
    .delete(function(req, res) {
        res.send(req.params.id.toString())
    })

router.param('id', function(req, res, next, id) {
    console.log(id);
    next();
})


module.exports = router;