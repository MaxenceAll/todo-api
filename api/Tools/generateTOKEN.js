const jwt = require("jsonwebtoken");
const config = require("../config");

const api_key = "!Ml_MOAUG8X)kTkbkuF6]JkyRAO/SD-K"; // one of the valid keys specified in the config

const authorization = jwt.sign(api_key, config.authorization.secret);
console.log(authorization); // this will output a JWT token signed with the secret key specified in the config
