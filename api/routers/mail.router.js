const express = require("express");
const mailRouter = express.Router();
const nodemailer = require('nodemailer');

const { body, validationResult } = require('express-validator');

const { EMAIL , PASSWORD } = require('../../gmailCFG')

mailRouter.post("/mail/test",
  // Validate and sanitize the email fields in the req.body object
  [
    body('to').isEmail().normalizeEmail(),
    body('subject').trim().escape(),
    body('message').trim().escape()
  ],
  async (req, res) => {
    console.log("test mail route taken");

    // Check for validation errors and return 400 if present
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, subject, message } = req.body;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });
    // let transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: "molly.von@ethereal.email",
    //         pass: "xWFHRPWkMqNK4JU86G"
    //     }
    // });


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'maxtestnodejs@gmail.com',
        to: to,
        subject: subject,
        text: message
    });
    // console.log(info);

    return res.status(201).json({
        msg: "e-mail sent!",
        info: info.messageId,
        // preview: nodemailer.getTestMessageUrl(info)
    });
});



module.exports = mailRouter;
