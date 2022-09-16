const express = require('express');
const router = express.Router();
const client = require('../src/database')

router.get('/', async function(req, res) {
    const value = await client.get('tree');
    res.send(value)
})

router.route('/:id')
    .get(function(req, res) {
        
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