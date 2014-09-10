'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  postit: { type: Schema.Types.ObjectId, ref: 'Postit' },
  description: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);
