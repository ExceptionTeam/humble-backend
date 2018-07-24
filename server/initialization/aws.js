const AWS = require('aws-sdk');

const credentials = new AWS.SharedIniFileCredentials({ profile: 'artem' });
AWS.config.credentials = credentials;
const s3bucket = new AWS.S3();

module.exports = s3bucket;
