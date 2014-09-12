'use strict';

var _ = require('lodash');
var Poi = require('./poi.model');
var s3 = require("../../components/s3");


// Get a single postit
exports.show = function(req, res) {
  Poi.findById(req.params.id).exec(function (err, poi) {
    if(err) { return handleError(res, err); }
    if(!poi) { return res.send(404); }
    return res.json(poi);
  });
};

exports.searchByLocation = function(req, res) {
  var location = [0,0];
  location[0] = req.param("lat");
  location[1] = req.param("lon");
  var limit = req.param("limit") || 20;
  Poi.find().where("loc").near({center: location, maxDistance: 0.05}).limit(limit).exec(function(err, results, stats) {
    if(err) { return handleError(res, err); }
    return res.send(results);
  });
}


function handleError(res, err) {
  return res.send(500, err);
}
