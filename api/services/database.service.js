const mysql = require("mysql2/promise");
const config = require("../config");

let db;
async function connect() {
  if (!db) {
    const { host, port, database, user, password } = config.db;
    db = await mysql.createConnection({
      host,
      port,
      database,
      user,
      password,
    });
  }
  return db;
}

async function query(sql) {
  const connection = await connect();
  const [rows] = await connection.query(sql);
  return rows;
}

async function selectAll(table) {
  const sql = `SELECT * FROM ${table} WHERE is_deleted = 0`;
  let resp;
  await query(sql)
    .then((data) => {
      resp = {
        data,
        result: true,
        message: `all rows of table ${table} have been selected`,
      };
    })
    .catch((err) => {
      resp = { data: null, result: false, message: err.message };
    });
  return resp;
}

async function selectOne(table, id) {

}

async function createOne(table) {

}

async function updateOne(table, id) {

}

async function softDeleteOne(table, id) {

}

async function hardDeleteOne(table, id) {

}

module.exports = {
  query,
  selectAll,
  selectOne,
  createOne,
  updateOne,
  softDeleteOne,
  hardDeleteOne,
};