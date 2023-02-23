const {query} = require("./api/services/database.service");
const { db } = require("./api/config");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: ["http://localhost:3001"], credentials: true }));

const bcrypt = require("bcrypt");
const config = require("./api/config");

const jwt = require("jsonwebtoken");

const cookieParser = require('cookie-parser');
app.use(cookieParser());


// Verif de la clé pour verif si acces à l'API ou pas
const accesMiddleware = require('./api/middleware/acces.middleware')
app.use(accesMiddleware);

// Verif de l'authentification (le login est-il OK ? verif avec JWT)
const authRouter = require('./api/routers/auth.router');
app.use(authRouter);
// app.get("/auth", async (req, res) => {
//   const authCookie = req?.cookies?.auth;
//   try {
//     if (!authCookie) {
//       throw new Error("Bad Auth");
//     }
//     const data = jwt.verify(authCookie, config.token.secret);
//     if (!data) {
//       throw new Error("Bad Auth");
//     }
//     res.json({ data, result: true, message: `Auth OK` });
//   } catch {
//     res.json({ data: null, result: false, message: `Bad Auth` });
//   }
// });
// app.post('/login', async (req, res) => {
//     const { body } = req;
//     const sql = `SELECT * FROM customer WHERE is_deleted = 0 AND email = "${body.email}"`;
//     await query(sql)
//         .then( async (json) => {
//             console.log(json);
//             const user = json.length === 1 ? json.pop() : null;
//             console.log(user);
//             if (user){

//                 const pincodeMatch = await bcrypt.compare(body.pincode, config.hash.prefix + user.pincode);
//                 if (!pincodeMatch){
//                     throw new Error ("bad login!");
//                 }
//                 const {id, email} = user;
//                 const data = {id, email};
//                 const token = jwt.sign(data, config.token.secret)
//                 res.json({data, result: true, message: `Login OK`, token});
//             } else {
//                 throw new Error("Bad login");
//             }
//         })
//         .catch((err) => {
//             res.json({data: null, result: false, message: err.message});
//         });
// });

app.get("/", async (req,res) =>
{    
    const result = await query("SHOW TABLES");
    res.json(result);
});




app.get('/:table', async (req, res) => { 
    const { table } = req.params;
    const sql = `SELECT * FROM ${table} WHERE is_deleted = 0`;
    await query(sql)
    .then(data => {
        res.json({data, result: true, message: `all rows of table ${table} have been selected`});
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
})

app.get('/:table/:id', async (req, res) => { 
    const { table, id } = req.params;
    const sql = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
    await query(sql)
    .then(data => {
        data = data.length == 1 ? data.pop() : null;
        const result = data != null;
        const message = (result ? `the` : `no`) + ` row of table ${table} with id=${id} has been selected`
        res.json({data, result, message});
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
})

app.post('/:table', async (req, res) => { 
    const { table } = req.params;
    const { body } = req;
    for(const key in body){
        if(typeof body[key] == "string")
            body[key] = body[key].replace(/'/g, "\\'");
    }
    const keys = Object.keys(body).join(",");
    const values = "'" + Object.values(body).join("','") + "'";
    const sqlInsert = `INSERT INTO ${table} ( ${keys} ) VALUES ( ${values} )`;
    await query(sqlInsert)
    .then(insertResult => {
        const { insertId } = insertResult;
        const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${insertId}`;
        query(sqlSelect)
        .then(data => {
            data = data.length == 1 ? data.pop() : null;
            const result = data != null  && insertResult.affectedRows == 1 ;
            const message = (result ? `a` : `no`) + ` row with id=${insertId} has been inserted in table ${table}`
            res.json({data, result, message});
        })
        .catch(err => {
            res.json({data: null, result: false, message: err.message});
        });
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
})

app.put('/:table/:id', async (req, res) => { 
    const { table, id } = req.params;
    const { body } = req;
    for(const key in body){
        if (key == "is_deleted")
            delete body[key];
        if(typeof body[key] == "string")
            body[key] = body[key].replace(/'/g, "\\'");
    }
    const entries = Object.entries(body);
    const values = entries.map(entry => {
        const [key, value] = entry;
        return `${key}='${value}'`;
    }).join(',')
    const sqlUpdate = `UPDATE ${table} SET ${values} WHERE id = ${id} AND is_deleted = 0`;
    await query(sqlUpdate)
    .then(updateResult => {
        const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
        query(sqlSelect)
        .then(data => {
            data = data.length == 1 ? data.pop() : null;
            const result = data != null && updateResult.affectedRows == 1 ;
            const message = (result ? `the` : `no`) + ` row of table ${table} with id=${id} has been updated`
            res.json({data, result, message});
        })
        .catch(err => {
            res.json({data: null, result: false, message: err.message});
        });
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
})

app.patch('/:table/:id', async (req, res) => { 
    const { table, id } = req.params;
    const sqlUpdate = `UPDATE ${table} SET is_deleted = 1 WHERE id = ${id} AND is_deleted = 0`;
    await query(sqlUpdate)
    .then(updateResult => {
        const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 1 AND id = ${id}`;
        query(sqlSelect)
        .then(data => {
            data = data.length == 1 ? data.pop() : null;
            const result = data != null && updateResult.affectedRows == 1;
            const message = (result ? `the` : `no`) + ` row of table ${table} with id=${id} has been softly deleted`
            res.json({data, result, message});
        })
        .catch(err => {
            res.json({data: null, result: false, message: err.message});
        });
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
})

app.delete('/:table/:id', async (req, res) => { 
    const { table, id } = req.params;
    const sqlDelete = `DELETE FROM ${table} WHERE id = ${id}`;
    await query(sqlDelete)
    .then(deleteResult => {
        const sqlSelect = `SELECT * FROM ${table} WHERE id = ${id}`;
        query(sqlSelect)
        .then(data => {
            const result = data.length == 0 && deleteResult.affectedRows == 1;
            const message = (result ? `the` : `no`) + ` row of table ${table} with id=${id} has been hardly deleted`
            res.json({data, result, message});
        })
        .catch(err => {
            res.json({data: null, result: false, message: err.message});
        });
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
})

const PORT = 1337;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})
