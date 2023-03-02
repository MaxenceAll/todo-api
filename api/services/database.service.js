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

async function query(sql, params = []) {
  const connection = await connect();
  // const [rows] = await connection.execute(sql);
  const statement = await connection.prepare(sql);
  const [rows] = await statement.execute(params);
  return rows;
}

async function selectAll(table) {
  const sql = `SELECT * FROM ${table} WHERE is_deleted = ?`;
  let resp;
  await query(sql, [0])
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
  const sql = `SELECT * FROM ${table} WHERE is_deleted = ? AND id = ?`;
  let resp;
  await query(sql, [0, id])
    .then((data) => {
      data = data.length == 1 ? data.pop() : null;
      const result = data != null;
      const message =
        (result ? `the` : `NO`) +
        ` row of table ${table} with id=${id} has been selected`;
      resp = { data, result, message };
    })
    .catch((err) => {
      resp = { data: null, result: false, message: err.message };
    });
  return resp;
}

async function createOne(table, body) {
  // for (const key in body) {
  //   if (typeof body[key] == "string")
  //     body[key] = body[key].replace(/'/g, "\\'");
  // }
  const keys = Object.keys(body).join(",");
  // const values = "'" + Object.values(body).join("','") + "'";
  const values = Object.values(body).map(()=>"?").join(",");
  const params = Object.values(body);
  const sqlInsert = `INSERT INTO ${table} ( ${keys} ) VALUES ( ${values} )`;
  let resp;
  await query(sqlInsert, params)
    .then(async (insertResult) => {
      const { insertId } = insertResult;
      const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${insertId}`;
      await query(sqlSelect)
        .then((data) => {
          data = data.length == 1 ? data.pop() : null;
          const result = data != null && insertResult.affectedRows == 1;
          const message =
            (result ? `a` : `NO`) +
            ` row with id=${insertId} has been inserted in table ${table}`;
          resp = { data, result, message };
        })
        .catch((err) => {
          resp = { data: null, result: false, message: err.message };
        });
    })
    .catch((err) => {
      resp = { data: null, result: false, message: err.message };
    });
  return resp;
}

async function updateOne(table, id, body) {
    for (const key in body) {
        if (key == "is_deleted") delete body[key];
    
        // if (typeof body[key] == "string")
        //   body[key] = body[key].replace(/'/g, "\\'");
      }
      const entries = Object.entries(body);
      const params = [];
      const values = entries
        .map((entry) => {
          const [key, value] = entry;
          params.push(value)
          return `${key}=?`;
        })
        .join(",");
      const sqlUpdate = `UPDATE ${table} SET ${values} WHERE is_deleted = ? AND id = ?`;
      params.push(0, id);
      let resp;
      await query(sqlUpdate, params)
        .then(async (updateResult) => {
          const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
          await query(sqlSelect)
            .then((data) => {
              data = data.length == 1 ? data.pop() : null;
              const result = data != null && updateResult.affectedRows == 1;
              const message =
                (result ? `the` : `NO`) +
                ` row of table ${table} with id=${id} has been updated`;
                resp = { data, result, message };
            })
            .catch((err) => {
                resp = { data: null, result: false, message: err.message };
            });
        })
        .catch((err) => {
            resp = { data: null, result: false, message: err.message };
        });
        return resp;
}

async function softDeleteOne(table, id) {
    const sqlUpdate = `UPDATE ${table} SET is_deleted = ? WHERE is_deleted = ? AND id = ?`;
    let resp;
    await query(sqlUpdate, [1, 0, id])
      .then(async (updateResult) => {
        const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 1 AND id = ${id}`;
        await query(sqlSelect)
          .then((data) => {
            data = data.length == 1 ? data.pop() : null;
            const result = data != null && updateResult.affectedRows == 1;
            const message =
              (result ? `the` : `NO`) +
              ` row of table ${table} with id=${id} has been softly deleted`;
              resp = { data, result, message };
          })
          .catch((err) => {
            resp = { data: null, result: false, message: err.message };
          });
      })
      .catch((err) => {
        resp = { data: null, result: false, message: err.message };
      });
      return resp;
}

async function hardDeleteOne(table, id) {
    const sqlDelete = `DELETE FROM ${table} WHERE id = ?`;
    let resp;
    await query(sqlDelete, [id])
      .then(async (deleteResult) => {
        const sqlSelect = `SELECT * FROM ${table} WHERE id = ${id}`;
        await query(sqlSelect)
          .then((data) => {
            const result = data.length == 0 && deleteResult.affectedRows == 1;
            const message =
              (result ? `the` : `NO`) +
              ` row of table ${table} with id=${id} has been hardly deleted`;
              resp = { data, result, message };
          })
          .catch((err) => {
            resp = { data: null, result: false, message: err.message };
          });
      })
      .catch((err) => {
        resp = { data: null, result: false, message: err.message };
      });
      return resp;
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