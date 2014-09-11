'use strict';

var express = require('express');
var controller = require('./postit.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/searchByLocation', controller.searchByLocation);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

router.post("/:id/vote", auth.isAuthenticated(), controller.addVote);
router.delete("/:id/vote", auth.isAuthenticated(), controller.deleteVote);

module.exports = router;
