const config = require("../config")
const nodemailer = require("nodemailer");
const mailer = {}

mailer.send = async (params) =>{
    console.log("Tentative d'envoi de mail !")
    try {
        const transporter = nodemailer.createTransport(config.mail);
        const info = await transporter.sendMail(params);
        const result = info.accepted.length > 0;
        return {data : info, result , message: result? 'email sent':'email not sent'};
    } catch (error) {
        return  { data: error, result: false , message: 'No mail sent :(!'}
    }
}

module.exports = mailer;