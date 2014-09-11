'use strict';

var _ = require('lodash');
var Postit = require('./postit.model');
var s3 = require("../../components/s3");

// Get list of postits
exports.index = function(req, res) {
  Postit.find(function (err, postits) {
    for (var i = postits.length - 1; i >= 0; i--) {
      postits[i] = postits[i].toObject({virtuals: true});
    };
    if(err) { return handleError(res, err); }
    return res.json(200, postits);
  });
};

// Get a single postit
exports.show = function(req, res) {
  Postit.findById(req.params.id, function (err, postit) {
    if(err) { return handleError(res, err); }
    if(!postit) { return res.send(404); }
    return res.json(postit);
  });
};

// Creates a new postit in the DB.
exports.create = function(req, res) {
  var postitInfo = _.clone(req.body);
  postitInfo.owner = req.user._id;
  postitInfo.location = [req.body.lat, req.body.lon];
  Postit.create(postitInfo, function(err, postit) {
    if(err) { return handleError(res, err); }
    s3.generateUrl("image/png", "postit/cover_" + postit._id + ".png", function(credentials) {
      var postitInfos = postit.toObject();
      postitInfos.imageUpload = credentials;
      return res.json(201, postitInfos);
    });
  });
};

// Updates an existing postit in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Postit.findById(req.params.id, function (err, postit) {
    if (err) { return handleError(res, err); }
    if(!postit) { return res.send(404); }
    if (postit.owner.toString() !== req.user._id.toString()) {return res.send(403, {error: "Only the owner of the postit can modify it"})}
    if (req.body.title && req.body.title.toString() !== postit.title.toString()) {return res.send(400, {error: "You cannot change the title of your postit"})}
    if (req.body.owner && req.body.owner.toString() !== postit.owner.toString()) {return res.send(400, {error: "You cannot change the owner of your postit"})}
    var updated = _.merge(postit, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, postit);
    });
  });
};

// Deletes a postit from the DB.
exports.destroy = function(req, res) {
  Postit.findById(req.params.id, function (err, postit) {
    if(err) { return handleError(res, err); }
    if(!postit) { return res.send(404); }
    if (postit.owner.toString() !== req.user._id.toString()) {return res.send(403, {error: "Only the owner of the postit can delete it"})}
    postit.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.searchByLocation = function(req, res) {
  var location = [0,0];
  location[0] = req.param("lat");
  location[1] = req.param("lon");
  var limit = req.param("limit") || 20;
  Postit.find().where("location").near({center: location, maxDistance: 5}).limit(limit).exec(function(err, results, stats) {
    if(err) { return handleError(res, err); }
    return res.send(results);
  });
}

function handleError(res, err) {
  return res.send(500, err);
}
