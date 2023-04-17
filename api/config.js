const dotenv = require("dotenv");
dotenv.config();

const config = {
    dev: {
        db: {
            host: "localhost",
            port: "3306",
            user: "root",
            password: "",
            database:"todo_db"
        },
        hash: {
            prefix: "$2b$08$"
        },
        token: {
            secret: "Wp].p77qJiLV)jMw6!GXAhzyi(tTaciU"
        },
        authorization:{
            secret: "pf[cX]RnE7!.2uNj/hkaPzfC./jMKIIn",
            keys: ["!Ml_MOAUG8X)kTkbkuF6]JkyRAO/SD-K"]
        },
        mail:{
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "maxtestnodejs@gmail.com",
                pass: 'poevpzgbtwujayrb'
            },
        }
    },

    prod: {
        db: {
            host: "",
            port: "",
            user: "",
            password: "",
            database: ""
        },
        hash: {
            prefix: "$2b$08"
        },
    }
}

module.exports = config[process.env.NODE_ENV];