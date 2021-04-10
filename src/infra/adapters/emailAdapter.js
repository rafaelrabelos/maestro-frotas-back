const sendgridAdapter = require("./sendgridAdapter");
const mailjetAdapter = require("./MailjetAdapter");

const defaultAdapter = mailjetAdapter;

module.exports = {
  sendgridAdapter,
  mailjetAdapter,
  defaultAdapter
};
