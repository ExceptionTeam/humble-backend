const nodemailer = require('nodemailer');

const { mailerCredentials } = require('../../top-secret');

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: mailerCredentials,
});

module.exports.sendMail = function (to, subject, text) {
  transport.sendMail({
    from: mailerCredentials.user,
    to,
    subject,
    text,
  });
};
