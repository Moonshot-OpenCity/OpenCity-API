'use strict';

var express = require('express');
var controller = require('./poi.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

console.log("coucou")

router.get('/searchByLocation', controller.searchByLocation);
router.get('/:id', controller.show);

module.exports = router;
