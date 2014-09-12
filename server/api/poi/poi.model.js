'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PoiSchema = new Schema({
  type: {type: Number, required: true},
  OSMid: {type: String, required: true},
  name: {type: String, required: true},
  loc: {
    type: [Number],
    index: '2d',
    required: true
  }
});

var model = module.exports = mongoose.model('Poi', PoiSchema);
