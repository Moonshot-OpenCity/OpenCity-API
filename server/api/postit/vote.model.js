'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var voteTypes = ["positive", "negative"];

var VoteSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  postit: { type: Schema.Types.ObjectId, ref: 'Postit' },
  type: {type: String, required: true},
  createdAt: {type: Date, default: Date.now}
});

VoteSchema.path("type")
    .validate(function(type) {
        return voteTypes.indexOf(type) + 1;
    }, 'Invalid Vote type');

var model = module.exports = mongoose.model('Vote', VoteSchema);
