'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Vote = require("./vote.model");

var postitTypes = ["positive", "negative"];

var PostitSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  location: {
    type: [Number],
    index: '2d',
    required: true
  },
  type: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

PostitSchema.virtual("coverURL").get(function() {
  return "https://opencity.s3-eu-west-1.amazonaws.com/postit/cover_" + this._id + ".png";
});
PostitSchema.method("getScore", function(callback) {
  var that = this;
  var o = {};
  o.map = function() { emit(this._id, this.type === "positive" ? 1 : -1); }
  o.reduce = function(ids, votes) { return Array.sum(votes); }
  o.out = {inline: 1};
  o.query = {postit: that._id};
  Vote.mapReduce(o, function(err, model, stats) {
    console.log(err, model, stats);
    callback(err, model.lenght ? model[0].value : 0);
  });
});


PostitSchema.path("type")
    .validate(function(type) {
        return postitTypes.indexOf(type) + 1;
    }, 'Invalid Postit type');
PostitSchema
  .path('title')
  .validate(function(title) {
    return title.length;
  }, 'Title cannot be blank');
PostitSchema
  .path('description')
  .validate(function(description) {
    return description.length;
  }, 'Description cannot be blank');
PostitSchema
  .path('location')
  .validate(function(location) {
    return !!location && location.length === 2;
  }, 'Location cannot be blank');


var model = module.exports = mongoose.model('Postit', PostitSchema);
