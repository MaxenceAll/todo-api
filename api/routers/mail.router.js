// ici ma version pour mailer
const express = require("express");
const mailRouter = express.Router();
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../../gmailCFG')
const { body, validationResult } = require('express-validator');
const validator = require('email-validator');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PASSWORD
  }
});

function validateEmail(req, res, next) {
  // Validate and sanitize the email fields in the req.body object
  [
    body('to').isString(),
    body('subject').isString().trim().escape(),
    body('message').isString().trim().escape(),
    body('html').isString().trim().escape(),
  ]
  next();
}

mailRouter.post("/mail/test", validateEmail, async (req, res) => {
  console.log("test mail route taken");

  // Check for validation errors and return 400 if present
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Validate the email addresses in the 'to' field
  const toAddresses = req.body.to.split(',').map(address => address.trim());
  const invalidAddresses = toAddresses.filter(address => !validator.validate(address));
  if (invalidAddresses.length > 0) {
    return res.status(400).json({ errors: `Invalid email address: ${invalidAddresses[0]}` });
  }

  // send mail with defined transport object
  const to = toAddresses.join(', ');
  transporter.sendMail({
    from: EMAIL,
    to,
    subject: req.body.subject,
    text: req.body.message,
    html: req.body.html
  })
  .then(info => {
    res.status(201).json({
      data: info,
      result: true,
      msg: `e-mail sent to ${to}!`,
      info: info.messageId,
    });
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({
      data: error,
      result: false,
      msg: `failed to send email to ${to}!`
    });
  })
  .finally(() => {
    // close the transporter after sending the email
    transporter.close();
  });
});

module.exports = mailRouter;
