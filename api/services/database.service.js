const mysql = require("mysql2/promise");
const config = require("../config");

let db;
async function connect() {
  if (!db) {
    console.log("new connexion made");
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
  console.log("query method called");
  const connection = await connect();
  // const [rows] = await connection.execute(sql);
  const statement = await connection.prepare(sql);
  const [rows] = await statement.execute(params);
  console.log("sql called:", sql);
  return rows;
}

async function selectAll(table) {
  console.log("selectAll method called");
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
  console.log("selectOne method called");
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
  console.log("createOne method called");
  // for (const key in body) {
  //   if (typeof body[key] == "string")
  //     body[key] = body[key].replace(/'/g, "\\'");
  // }
  const keys = Object.keys(body).join(",");
  // const values = "'" + Object.values(body).join("','") + "'";
  const values = Object.values(body)
    .map(() => "?")
    .join(",");
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
  console.log("updateOne method called");
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
      params.push(value);
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
  console.log("softDeleteOne method called");
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
  console.log("hardDeleteOne method called");
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

async function selectAllWithIdcustomer(email) {
  console.log("Param is:", email);
  const sql = `
    SELECT t.*
    FROM todo t
    JOIN customer c ON t.id_customer = c.id
    WHERE t.is_deleted = 0 AND c.email = ?
  `;
  let resp;
  await query(sql, [email])
    .then((data) => {
      resp = {
        data,
        result: true,
        message: `All todos for customer with e-mail ${email} have been selected`,
      };
    })
    .catch((err) => {
      resp = { data: null, result: false, message: err.message };
    });
  return resp;
}


async function selectAllTaskWithEmail(email) {
  console.log("Executing selectAllTaskWithEmail with email:", email);
  const sql = `SELECT t.*, td.id_customer
  FROM task t
  INNER JOIN todo td ON t.id_Todo = td.id
  INNER JOIN customer c ON td.id_customer = c.id
  WHERE c.email = ? AND t.is_deleted = 0`;
  let resp;
  await query(sql, [email])
    .then((data) => {
      resp = {
        data,
        result: true,
        message: `All tasks from ${email}`,
      };
    })
    .catch((err) => {
      resp = { data: null, result: false, message: err.message };
    });
  return resp;
}

async function selectAllTaskWithIdTodo(IdTodo) {
  console.log("Executing selectAllTaskWithIdTodo with id:", IdTodo);
  const sql = `SELECT * FROM task WHERE id_Todo = ? AND is_deleted = 0`;
  let resp;
  await query(sql, [IdTodo])
    .then((data) => {
      resp = {
        data,
        result: true,
        message: `All tasks with id_Todo ${IdTodo}`,
      };
    })
    .catch((err) => {
      resp = { data: null, result: false, message: err.message };
    });
  return resp;
}

async function checkIfAdmin(email) {
  console.log("Executing checkIfAdmin with email:", email);
  const sql = `SELECT * FROM customer WHERE email = ? AND is_admin = 1`;
  let resp;
  await query(sql, [email])
    .then((data) => {
      if (data.length > 0) {
        resp = {
          data:  1,
          result: true,
          message: `User ${email} IS AN ADMIN`,
        };
      } else {
        resp = {
          data : 0,
          result: true,
          message: `User ${email} is not an admin`,
        };
      }
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
  selectAllWithIdcustomer,
  selectAllTaskWithEmail,
  selectAllTaskWithIdTodo,
  checkIfAdmin,
};
