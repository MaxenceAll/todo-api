const express = require("express");
const dbRouter = express.Router();
const dbService = require("../services/database.service");
// console.log(dbService);

dbRouter.all("*", async (req, res, next) => {
  console.log("all route taken");
  const table = req.params[0]
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .split("/")[0];
  console.log("table selected :", table);
  if (global.tables.includes(table)) {
    next();
  } else {
    res
      .status(400)
      .json({
        data: null,
        result: false,
        message: "Bad request wrong table ?",
      });
  }
});



// moved top get catch first this when..
dbRouter.get('/customer', async (req, res) => {
  console.log("get all customers route taken");
  const dbResp = await dbService.selectAll("customer");
  res.status(dbResp?.result ? 200 : 400).json(dbResp);
});






dbRouter.get("/:table", async (req, res) => {
  console.log("get table route taken");
  const { table } = req.params;
  const dbResp = await dbService.selectAll(table);
  res.status(dbResp?.result ? 200 : 400).json(dbResp);
});

//TODO NOT SAFE, USE 
dbRouter.get("/:table/:id", async (req, res) => {
  console.log("get table+id route taken");
  const { table, id } = req.params;
  const sql = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
  await dbService
    .query(sql)
    .then((data) => {
      data = data.length == 1 ? data.pop() : null;
      const result = data != null;
      const message =
        (result ? `the` : `NO`) +
        ` row of table ${table} with id=${id} has been selected`;
      res.json({ data, result, message });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

dbRouter.post("/:table", async (req, res) => {
  const { table } = req.params;
  const { body } = req;
  for (const key in body) {
    if (typeof body[key] == "string")
      body[key] = body[key].replace(/'/g, "\\'");
  }
  const keys = Object.keys(body).join(",");
  const values = "'" + Object.values(body).join("','") + "'";
  const sqlInsert = `INSERT INTO ${table} ( ${keys} ) VALUES ( ${values} )`;
  await dbService
    .query(sqlInsert)
    .then((insertResult) => {
      const { insertId } = insertResult;
      const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${insertId}`;
      dbService
        .query(sqlSelect)
        .then((data) => {
          data = data.length == 1 ? data.pop() : null;
          const result = data != null && insertResult.affectedRows == 1;
          const message =
            (result ? `a` : `NO`) +
            ` row with id=${insertId} has been inserted in table ${table}`;
          res.json({ data, result, message });
        })
        .catch((err) => {
          res.json({ data: null, result: false, message: err.message });
        });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

dbRouter.put("/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  const { body } = req;
  for (const key in body) {
    if (key == "is_deleted") delete body[key];

    if (typeof body[key] == "string")
      body[key] = body[key].replace(/'/g, "\\'");
  }
  const entries = Object.entries(body);
  const values = entries
    .map((entry) => {
      const [key, value] = entry;
      return `${key}='${value}'`;
    })
    .join(",");
  const sqlUpdate = `UPDATE ${table} SET ${values} WHERE is_deleted = 0 AND id = ${id}`;
  await dbService
    .query(sqlUpdate)
    .then((updateResult) => {
      const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
      dbService
        .query(sqlSelect)
        .then((data) => {
          data = data.length == 1 ? data.pop() : null;
          const result = data != null && updateResult.affectedRows == 1;
          const message =
            (result ? `the` : `NO`) +
            ` row of table ${table} with id=${id} has been updated`;
          res.json({ data, result, message });
        })
        .catch((err) => {
          res.json({ data: null, result: false, message: err.message });
        });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

dbRouter.patch("/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  const sqlUpdate = `UPDATE ${table} SET is_deleted = 1 WHERE is_deleted = 0 AND id = ${id}`;
  await dbService
    .query(sqlUpdate)
    .then((updateResult) => {
      const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 1 AND id = ${id}`;
      dbService
        .query(sqlSelect)
        .then((data) => {
          data = data.length == 1 ? data.pop() : null;
          const result = data != null && updateResult.affectedRows == 1;
          const message =
            (result ? `the` : `NO`) +
            ` row of table ${table} with id=${id} has been softly deleted`;
          res.json({ data, result, message });
        })
        .catch((err) => {
          res.json({ data: null, result: false, message: err.message });
        });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

dbRouter.delete("/:table/:id", async (req, res) => {
  const { table, id } = req.params;
  const sqlDelete = `DELETE FROM ${table} WHERE id = ${id}`;
  await dbService
    .query(sqlDelete)
    .then((deleteResult) => {
      const sqlSelect = `SELECT * FROM ${table} WHERE id = ${id}`;
      dbService
        .query(sqlSelect)
        .then((data) => {
          const result = data.length == 0 && deleteResult.affectedRows == 1;
          const message =
            (result ? `the` : `NO`) +
            ` row of table ${table} with id=${id} has been hardly deleted`;
          res.json({ data, result, message });
        })
        .catch((err) => {
          res.json({ data: null, result: false, message: err.message });
        });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});


dbRouter.get('/todo/table/:email', async (req, res) => {
  const { email} = req.params;
  const dbResp = await dbService.selectAllWithIdcustomer(email);
  res.status(dbResp?.result ? 200 : 400).json(dbResp);
});


dbRouter.get('/task/table/:email', async (req, res) => {
  const { email } = req.params;
  const dbResp = await dbService.selectAllTaskWithEmail(email);
  res.status(dbResp?.result ? 200 : 400).json(dbResp);
});

dbRouter.get('/task/task/:idTodo', async (req, res) => {
  const { idTodo } = req.params;
  const dbResp = await dbService.selectAllTaskWithIdTodo(idTodo);
  res.status(dbResp?.result ? 200 : 400).json(dbResp);
});


dbRouter.get('/customer/admin/:email', async (req, res) => {
  const { email } = req.params;
  const dbResp = await dbService.checkIfAdmin(email);
  res.status(dbResp?.result ? 200 : 400).json(dbResp);
});






module.exports = dbRouter;
