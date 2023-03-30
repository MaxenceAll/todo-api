// Import du framework express:
const express = require("express");
const app = express();

// Import de Cors pour pouvoir recevoir les json d'ailleurs:
const cors = require("cors");
// le cross origin provient de : (voir origin)
app.use(cors(
  { 
    origin: ["http://localhost:3000" , "http://localhost:5173"],
    credentials: true
  }
));

// On autorise notre app express l'utilisation de json:
app.use(express.json());

// Import de cookieParser
const cookieParser = require("cookie-parser");
// on l'ajoute à notre app
app.use(cookieParser());

// Import de la method query (on lui donne du SQL elle donne une resp)
const { query } = require("./api/services/database.service");

//IIFE
// https://flaviocopes.com/javascript-iife/
(async () => {
  let tables = await query("SHOW TABLES");
  tables = tables.map((row) => row.Tables_in_todo_db);
  global.tables = tables;
  console.log("All tables dispo", tables)
})();


// const accesMiddleware = require('./api/middleware/acces.middleware')
// app.use(accesMiddleware);

const authRouter = require('./api/routers/auth.router');
app.use(authRouter);

const mailRouter = require('./api/routers/mail.router');
app.use(mailRouter);

const dbRouter = require('./api/routers/db.router');
app.use(dbRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});