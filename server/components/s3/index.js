var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

var crypto = require("crypto");
var AWS = require("aws-sdk");

AWS.config.update({region: 'eu-west-1'});
var s3 = new AWS.S3();
exports.generateUrl = function(mimeType, name, callback) {
    var params = {Bucket: 'opencity', Key: name, ACL: "public-read"};
    s3.getSignedUrl('putObject', params, function(err, url) {
        callback(url);
    });
}
