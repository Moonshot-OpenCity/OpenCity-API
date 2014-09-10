'use strict';

var _ = require('lodash');
var Comment = require('./comment.model');
var Postit = require("../postit/postit.model");

// Get list of comments
exports.getByPostIt = function(req, res) {
  Comment.find({postit: req.param("postit")}, function (err, comments) {
    if(err) { return handleError(res, err); }
    return res.json(200, comments);
  });
};

// Get a single comment
exports.show = function(req, res) {
  Comment.findById(req.params.id, function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    return res.json(comment);
  });
};

// Creates a new comment in the DB.
exports.create = function(req, res) {
  if (!req.body.postit) {return res.send(400, {error: "Postit required."})}
  Postit.findById(req.param("postit"), function(err, postit) {
    if (err) { return handleError(res, err); }
    if(!postit) { return res.send(404, {error: "Postit not found"}); }
    var commentInfo = _.clone(req.body);
    commentInfo.owner = req.user._id;
    commentInfo.postit = postit._id;
    Comment.create(commentInfo, function(err, comment) {
      if(err) { return handleError(res, err); }
      return res.json(201, comment);
    });
  });
};

// Updates an existing comment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Comment.findById(req.params.id, function (err, comment) {
    if (err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    if (comment.owner.toString() !== req.user._id.toString()) {return res.send(403, {error: "Only the owner of the comment can modify it"})}
    if (req.body.owner && req.body.owner.toString() != comment.owner.toString()) {return res.send(400, {error: "You cannot change the owner of your comment"})}
    var updated = _.merge(comment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, comment);
    });
  });
};

// Deletes a comment from the DB.
exports.destroy = function(req, res) {
  Comment.findById(req.params.id, function (err, comment) {
    if(err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    if (comment.owner.toString() !== req.user._id.toString()) {return res.send(403, {error: "Only the owner of the comment can delete it"})}
    comment.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
