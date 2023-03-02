const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { query } = require("./api/services/database.service");

//IIFE
// https://flaviocopes.com/javascript-iife/

(async () => {
  let tables = await query("SHOW TABLES");
  tables = tables.map((row) => row.Tables_in_todo_db);
  global.tables = tables;
})();

// const accesMiddleware = require('./api/middlewares/acces.middleware')
// app.use(accesMiddleware);

const authRouter = require('./api/routers/auth.router');
app.use(authRouter);

const dbRouter = require('./api/routers/db.router');
app.use(dbRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});