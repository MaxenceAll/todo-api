const express = require("express");
const mailRouter = express.Router();
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../../gmailCFG')
const { body, validationResult } = require('express-validator');

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
      body('to').isEmail().normalizeEmail(),
      body('subject').trim().escape(),
      body('message').trim().escape()
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

        // send mail with defined transport object
        const { to, subject, message } = req.body;
        transporter.sendMail({
            from: EMAIL,
            to,
            subject,
            text: message
        })
        .then(info => {
            res.status(201).json({
                msg: `e-mail sent to ${to}!`,
                info: info.messageId,
            });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({
                msg: `failed to send email to ${to}!`,
            });
        })
        .finally(() => {
            // close the transporter after sending the email
            transporter.close();
        });
});

module.exports = mailRouter;