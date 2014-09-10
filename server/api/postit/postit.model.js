'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
