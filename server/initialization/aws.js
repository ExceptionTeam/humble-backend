const AWS = require('aws-sdk');
const { BUCKET_NAME } = require('../../config');

const credentials = new AWS.SharedIniFileCredentials();
AWS.config.credentials = credentials;
const s3 = new AWS.S3();

const params = {
  Bucket: BUCKET_NAME,
};
s3.headBucket(params, (err) => {
  if (err) {
    s3.createBucket(params, (err, data) => {
      if (err) { console.log(err, err.stack); }
    });
  }
});

module.exports = s3;
