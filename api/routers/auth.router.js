const express = require("express");
const authRouter = express.Router();
const { query, updateOne , createOne } = require("../services/database.service");
const bcrypt = require("bcrypt");
const config = require("../config");
const jwt = require("jsonwebtoken");
const mailer = require("../services/mailer.service");


authRouter.get("/auth", async (req, res) => {
  console.log("Auth router route taken");

  const authCookie = req?.cookies?.auth;
  console.log("Cookie token reçu : ", authCookie);
  try {
    if (!authCookie) {
      console.log("BadAuth / pas de cookie");
      throw new Error("Bad Auth");
    }
    const data = jwt.verify(authCookie, config.token.secret);
    if (!data) {
      console.log("BadAuth / pas de data");
      throw new Error("Bad Auth");
    }
    console.log("Auth ok ok !");
    res.json({ data, result: true, message: `Auth OK` });
  } catch {
    console.log("BadAuth / error catched");
    res.json({ data: null, result: false, message: `Bad Auth` });
  }
});

authRouter.post("/login", async (req, res) => {
  console.log("Login route taken");
  const { body } = req;
  console.log(body)
  const sql = `SELECT * FROM customer 
                  WHERE is_deleted = 0 
                  AND email = '${body.email}'`;
  await query(sql)
    .then(async (json) => {
      const user = json.length === 1 ? json.pop() : null;
      if (user) {
        console.log("user found")
        const pincodesMatch = await bcrypt.compare(
          body.pincode,
          config.hash.prefix + user.pincode
        );
        if (!pincodesMatch) {
          throw new Error("Bad Login 1");
        }
        const { id, email } = user;
        const data = { id, email };
        const token = jwt.sign(data, config.token.secret);
        res.json({ data, result: true, message: `Login OK`, token });
      } else {
        throw new Error("Bad Login 2");
      }
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

authRouter.post("/renew", async (req, res) => {
  console.log("Renew route taken");
  const { email } = req.body;
  const sql = 'SELECT * FROM customer WHERE is_deleted = 0 AND email = ?';
  await query(sql, [email])
  .then(async (json) => {
    const user = json.length === 1 ? json.pop() : null;
      if (user) {
        const { id, email } = user;
        const data = { id, email };
        const token = jwt.sign(data, config.token.secret);
        const html = `Pour renouveler votre mot de passe, cliquez sur ce lien <a href="http://localhost:3000/reset?t=${token}">Nouveau mot de passe</a>`;
        const mailParams = {
          to: email,
          subject: "Nouveau mot de passe demandé",
          html: html,
        };
        const mailResult = await mailer.send(mailParams);
        console.log(mailResult);
        res.json(mailResult);
      } else {
        throw new Error(
          "Error while trying to get your password back (either mail is wrong or doesnt exists)"
        );
      }
    })
    .catch((error) => {
      res.json({ data: null, result: false, message: error.message });
    });
});


authRouter.post("/reset", async (req, res) => {
  console.log("Reset route taken");
  const { body } = req;
  try {
    if (!body.token) {
      throw new Error("No token provided in the request");
    }
    const data = jwt.verify(body.token, config.token.secret);
    if (!data) {
      throw new Error("Invalid or expired token provided");
    }
    const hash = bcrypt.hashSync(body.pincode1, 8);
    const pincode = hash.replace(config.hash.prefix, "");
    const dbResp = await updateOne("customer", data.id, { pincode });
    res.json({ result: dbResp.result });
  } catch (error) {
    console.error(error);
    res.json({ data: null, result: false, message: error.message });
  }
});


authRouter.post("/signup", async (req, res) => {
  console.log("Signup route taken");
  const { body } = req;
  try {
    const hash = bcrypt.hashSync(body.pincode, 8);
    const pincode = hash.replace(config.hash.prefix, "");
    const bodyObj = { email: body.email, pincode: pincode };
    const dbResp = await createOne("customer", bodyObj);

    const data = { email: body.email };
    const token = jwt.sign(data, config.token.secret);
    res.json({ data, result: dbResp.result, message: dbResp.message, token });

    // res.json({ result: dbResp.result });
  } catch (err) {
    res.json({ data: null, result: false, message: err.message });
  }
});







module.exports = authRouter;
