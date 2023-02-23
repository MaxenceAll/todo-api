const express = require("express");
const accesMiddleware = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");

accesMiddleware.all("*", async (req, res, next) => {
    const authorization = req?.header?.authorization;
    try{
        if (!authorization){
            throw new Error ("Bad API key");
        }
        const result = jwt.verify (authorization, config.authorization.secret);
        if (!result || !config.authorization.keys.includes(result)) {
            throw new Error ("Bad API key (verif KO)");
        }
        next();
    } catch {
        res.status(401)
            .send({ data:null, result: false, message: `Bad API key (error while verif)`});
    }
});

module.exports = accesMiddleware;