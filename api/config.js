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