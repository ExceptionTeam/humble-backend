const AWS = require('aws-sdk');

const credentials = new AWS.SharedIniFileCredentials();
AWS.config.credentials = credentials;
const s3 = new AWS.S3();

module.exports = s3;
