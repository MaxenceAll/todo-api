const express = require("express");
const authRouter = express.Router();
const { query, updateOne, createOne } = require("../services/database.service");
const bcrypt = require("bcrypt");
const config = require("../config");
const jwt = require("jsonwebtoken");
const mailer = require("../services/mailer.service");
const { v4: uuid } = require("uuid");
const { escape } = require("mysql2");

const mysql = require("mysql2");

authRouter.get("/auth", async (req, res) => {
  console.log("Auth router route taken");

  const authCookie = req?.cookies?.auth;
  // console.log("Cookie token reçu : ", authCookie);
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
    console.log("BadAuth / error caught");
    res.json({ data: null, result: false, message: `Bad Auth` });
  }
});

// WEAK TO SQL INJECTIO ?
authRouter.post("/login", async (req, res) => {
  console.log("Login route taken");
  const { body } = req;
  console.log(body);

  // Escape the email value before using it in the SQL query
  const email = escape(body.email);

  const sql = `SELECT * FROM customer 
                  WHERE is_deleted = 0
                  AND is_verified = 1
                  AND email = ${email}`;
  await query(sql)
    .then(async (json) => {
      const user = json.length === 1 ? json.pop() : null;
      if (user) {
        console.log("user found");
        const pincodesMatch = await bcrypt.compare(
          body.pincode,
          config.hash.prefix + user.pincode
        );
        if (!pincodesMatch) {
          throw new Error("Bad Login");
        }
        const { id, email } = user;
        const data = { id, email };
        const token = jwt.sign(data, config.token.secret);
        res.json({ data, result: true, message: `Login OK`, token });
      } else {
        throw new Error("Bad Login");
      }
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

// WEAK TO SQL INJECTIO, FIX THIS //TODO
authRouter.post("/renew", async (req, res) => {
  console.log("Renew route taken");
  const { email } = req.body;
  const sql = "SELECT * FROM customer WHERE is_deleted = 0 AND email = ?";
  await query(sql, [email])
    .then(async (json) => {
      const user = json.length === 1 ? json.pop() : null;
      if (user) {
        const { id, email } = user;
        const data = { id, email };
        const token = jwt.sign(data, config.token.secret);
        // const html = `Pour renouveler votre mot de passe, cliquez sur ce lien <a href="http:/localhost:3000/reset?t=${token}">Nouveau mot de passe</a>`;
        const html = `Pour renouveler votre mot de passe, cliquez sur ce lien <a href="http:/localhost:5173/reset?t=${token}">Nouveau mot de passe</a>`;
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
    console.log("password changed");
  } catch (error) {
    console.error(error);
    res.json({ data: null, result: false, message: error.message });
  }
});

authRouter.post("/signup", async (req, res) => {
  console.log("Signup route taken");
  const { body } = req;
  console.log(body);
  try {
    const hash = bcrypt.hashSync(body.pincode, 8);
    console.log(hash);
    const pincode = hash.replace(config.hash.prefix, "");
    const emailVerificationToken = uuid(); // Generate unique token
    const bodyObj = {
      email: body.email,
      pincode: pincode,
      emailVerificationToken: emailVerificationToken,
    };
    console.log(bodyObj);

    // Check if account already exists
    const sql = `SELECT * FROM customer 
                 WHERE is_deleted = 0
                 AND email = ${mysql.escape(body.email)}`;
    const existingAccount = await query(sql);
    if (existingAccount.length > 0) {
      throw new Error("Account already exists");
    }else{
      console.log("Tentative de création du compte sur la db")
    }

    const dbResp = await createOne("customer", bodyObj);
    const data = { email: body.email };
    const token = jwt.sign(data, config.token.secret);
    console.log(data);

    // Send email to user to verify their email address
    const html = `Pour créer votre compte, vous devez le valider avant, en cliquant ici : <a href="http:/localhost:5173/verify-email?t=${emailVerificationToken}">Vérifiez votre compte.</a>`;
    const mailParams = {
      to: body.email,
      subject: "Validez votre compte TODO4000",
      html: html,
    };
    console.log("yo les mail params sont :", mailParams)
    // if (!existingAccount) {
      // Only send email if account doesn't already exist
      const mailResult = await mailer.send(mailParams);
      console.log("mailresult = ",mailResult);
    // }

    res.json({ data, result: dbResp.result, message: dbResp.message, token });
  } catch (err) {
    res.json({ data: null, result: false, message: err.message });
  }
});

// WEAK TO SQL INJECTIO, FIX THIS
authRouter.post("/verify-email", async (req, res) => {
  console.log("Verify email route taken");
  try {
    const { token } = req.body;
    console.log("token reçu à vérifier:", token);
    if (!token) {
      throw new Error("No token provided");
    }
    const sql = "SELECT * FROM customer WHERE emailVerificationToken = ?";
    const json = await query(sql, [token]);
    const user = json.length === 1 ? json.pop() : null;

    console.log("user found is :", user);
    if (!user) {
      console.log(
        "oops no user found with this token or its already validated"
      );
      throw new Error("Invalid token provided or Already validated");
    }
    console.log("user found, making this account verified.");
    const dbResp = await updateOne("customer", user.id, {
      is_verified: true,
      emailVerificationToken: null,
    });
    res.json({ result: dbResp.result, message: dbResp.message }); // NOT POSSIBLE TO SEND 2 RES
    // res.redirect("/success"); // Redirect user to success page
  } catch (error) {
    console.error(error);
    res.json({ data: null, result: false, message: error.message });
  }
});

module.exports = authRouter;
