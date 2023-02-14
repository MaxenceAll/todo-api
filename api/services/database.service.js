const mysql = require ("mysql2/promise");
// const dotenv = require("dotenv");
// dotenv.config();
// const config = require (`../configs/${process.env.NODE_ENV}.config`);
const config = require("../config");

let db; 
async function connect(){

    if (!db){
        const { host, port, database, user, password} = config.db;
        db = await mysql.createConnection(
            {
            host,
            port,
            database,
            user,
            password
            }
        );
    }
    // console.log(db);
    return db;
}

async function query(sql){
    const connexion = await connect();
    const [results] = await connexion.query(sql);
    return results;
}

module.exports = {query};