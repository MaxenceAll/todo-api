const express = require("express");
const authRouter = express.Router();
const { query } = require("../services/database.service");
const bcrypt = require("bcrypt");
const config = require("../config");
const jwt = require("jsonwebtoken");

//TODO GET/auth et POST/login
authRouter.get("/auth", async (req, res) => {
    console.log("Auth router route taken")
    
  const authCookie = req?.cookies?.auth;
  console.log("Cookie token reçu : ",authCookie)
  try {
    if (!authCookie) {
      console.log("BadAuth / pas de cookie")
      throw new Error("Bad Auth");
    }
    const data = jwt.verify(authCookie, config.token.secret);
    if (!data) {
      console.log("BadAuth / pas de data")
      throw new Error("Bad Auth");
    }
    console.log("Auth ok ok !")
    res.json({ data, result: true, message: `Auth OK` });
  } catch {
    console.log("BadAuth / error catched")
    res.json({ data: null, result: false, message: `Bad Auth` });
  }
});

authRouter.post("/login", async (req, res) => {
  const { body } = req;
  const sql = `SELECT * FROM customer 
                  WHERE is_deleted = 0 
                  AND email = '${body.email}'`;
  await query(sql)
    .then(async (json) => {
      const user = json.length === 1 ? json.pop() : null;
      if (user) {
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

module.exports = authRouter;